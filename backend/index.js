const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { getHealth } = require("./database/db.js");
const { obtenerOCrearEditorial } = require("./consultas/editoriales");
const { obtenerOCrearAutor } = require("./consultas/autores.js");
const { getGeneros, obtenerOCrearGenero } = require("./consultas/generos.js");
const { buscarLibroGoogleBooks } = require("./consultas/googleBooks.js");
const { buscarLibroOpenLibrary } = require("./consultas/openLibrary.js");
const { traducirTexto } = require("./consultas/traductor.js");
const {
  getLibros,
  getLibroById,
  updateDescuento,
  filtrarLibros,
  getLibroByIsbn,
  buscarLibros,
  crearLibro,
  desactivarLibro,
  actualizarLibro,
  agregarAutorLibro,
  agregarGeneroLibro,
  getPreventas
} = require("./consultas/libros.js");
const { 
  getCarrito,
  agregarLibroCarrito,
  actualizarCantidadCarrito,
  eliminarLibroCarrito,
  vaciarCarrito
} = require("./consultas/carrito.js");
const {
  getFavoritos,
  agregarFavorito,
  eliminarFavorito,
} = require("./consultas/favoritos.js");
const {
  getDireccionesCliente,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
} = require("./consultas/direcciones.js");
const {
  getEmpresasEnvio,
  crearEmpresaEnvio,
} = require("./consultas/empresasEnvio.js");
const {
  crearPedidoDesdeCarrito,
  getPedidosCliente,
  getDetallePedido,
} = require("./consultas/pedidos.js");

getHealth();

const api = express();

//Middlewares
api.use(express.json());
api.use(cors());

// Puerto donde escucha el back
const PORT = process.env.PORT || 3000;

// Ruta de prueba del servidor
api.get("/", (req, res) => {
  res.send("API libreria funcionando");
});

//Ruta Get para obtener todos los libros activos
api.get("/libros", async (req, res) => {
  console.log("GET /libros");
  try {
    const libros = await getLibros();
    res.json(libros);
  } catch (error) {
    console.error("❌ Error en GET /libros:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET para buscar libros del Navbar del frontend
api.get("/libros/buscar", async (req, res) => {
  console.log("GET /libros/buscar", req.query);
  const { q } = req.query;

  try {
    if (!q || q.trim() === "") {
      return res.status(400).json({
        message: "Debes enviar un término de búsqueda",
      });
    }

    const libros = await buscarLibros(q.trim());

    res.json({
      cantidad: libros.length,
      data: libros,
    });
  } catch (error) {
    console.error("❌ Error en GET /libros/buscar:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET para filtrar libros por título, autor o género
api.get("/libros/filtros", async (req, res) => {
  console.log("GET /libros/filtros", req.query);
  const { titulo, autor, genero } = req.query;

  try {
    const libros = await filtrarLibros({ titulo, autor, genero });

    res.json({
      cantidad: libros.length,
      data: libros,
    });
  } catch (error) {
    console.error("❌ Error en GET /libros/filtros:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

//ruta Get para buscar libros por ISBN en el formulario de registro de libros por admin
api.get("/libros/buscar-isbn/:isbn", async (req, res) => {
  console.log("GET /libros/buscar-isbn", req.params);
  const { isbn } = req.params;

  try {
    // 1. Buscar en BD en Neon
    const libroBD = await getLibroByIsbn(isbn);

    if (libroBD) {
      return res.json({
        origen: "base_datos",
        data: libroBD,
      });
    }

    // 2. Buscar en Open Library y traducir titulo y descripción
    const libroOpenLibrary = await buscarLibroOpenLibrary(isbn);

    if (libroOpenLibrary) {
      if (libroOpenLibrary.idioma !== "spa") {
        libroOpenLibrary.titulo = await traducirTexto(libroOpenLibrary.titulo);
        libroOpenLibrary.descripcion = await traducirTexto(
          libroOpenLibrary.descripcion,
        );

        libroOpenLibrary.generos = await Promise.all(
        (libroOpenLibrary.generos || []).map((genero) => traducirTexto(genero))
        );
        }

      return res.json({
        origen: "open_library",
        traducido: libroOpenLibrary.idioma !== "spa",
        data: libroOpenLibrary,
      });
    }

    // 3. Buscar en Google Books
    const libroGoogle = await buscarLibroGoogleBooks(isbn);

    if (libroGoogle) {
      return res.json({
        origen: "google_books",
        data: libroGoogle,
      });
    }

    // 4. No encontrado
    return res.status(404).json({
      message: "Libro no encontrado",
    });
  } catch (error) {
    console.error("❌ Error en GET /libros/buscar-isbn:", error);

    if (error.response?.status === 429) {
      return res.status(429).json({
        message: "Límite temporal alcanzado en API externa",
      });
    }

    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET para obtener un libro por ID
api.get("/libros/:id", async (req, res) => {
  console.log("GET /libros/:id", req.params);
  const { id } = req.params;

  try {
    const libro = await getLibroById(id);

    if (!libro) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }
    res.json(libro);
  } catch (error) {
    console.error("❌ Error en GET /libros/:id:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST para crear un nuevo libro
api.post("/libros", async (req, res) => {
  console.log("POST /libros", req.body);
  try {
    const {
      titulo,
      isbn,
      descripcion,
      precio,
      descuento = 0,
      formato,
      stock,
      editorial,
      fecha_publicacion,
      numero_paginas,
      imagen,
      autores = [],
      generos = [],
    } = req.body;

    if (!titulo || !isbn || !precio) {
      return res.status(400).json({
        message: "Título, ISBN y precio son obligatorios",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        message: "El stock no puede ser negativo",
      });
    }

    if (descuento < 0 || descuento > 100) {
      return res.status(400).json({
        message: "El descuento debe estar entre 0 y 100",
      });
    }

    const libroExistente = await getLibroByIsbn(isbn);

    if (libroExistente) {
      return res.status(400).json({
        message: "Ya existe un libro registrado con ese ISBN",
      });
    }

    const id_editorial = await obtenerOCrearEditorial(editorial);

    const nuevoLibro = await crearLibro({
      titulo,
      isbn,
      descripcion,
      precio,
      descuento,
      formato,
      stock,
      id_editorial,
      fecha_publicacion,
      numero_paginas,
      imagen,
    });

    for (const nombreAutor of autores) {
      const id_autor = await obtenerOCrearAutor(nombreAutor);
      await agregarAutorLibro(nuevoLibro.id_libro, id_autor);
    }

    for (const nombreGenero of generos) {
      const id_genero = await obtenerOCrearGenero(nombreGenero);
      await agregarGeneroLibro(nuevoLibro.id_libro, id_genero);
    }

    res.status(201).json({
      message: "Libro creado correctamente",
      data: nuevoLibro,
    });
  } catch (error) {
    console.error("❌ Error en POST /libros:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta PUT para actualizar un libro por ID
api.put("/libros/:id", async (req, res) => {
  console.log("PUT /libros/:id", req.params);
  const { id } = req.params;
  const { precio, stock, descuento } = req.body;

  try {
    if (
      precio === undefined &&
      stock === undefined &&
      descuento === undefined
    ) {
      return res.status(400).json({
        message: "Debes enviar al menos un campo: precio, stock o descuento",
      });
    }

    if (precio !== undefined && precio < 0) {
      return res.status(400).json({
        message: "El precio no puede ser negativo",
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        message: "El stock no puede ser negativo",
      });
    }

    if (descuento !== undefined && (descuento < 0 || descuento > 100)) {
      return res.status(400).json({
        message: "El descuento debe estar entre 0 y 100",
      });
    }

    const libroActualizado = await actualizarLibro(id, {
      precio,
      stock,
      descuento,
    });

    if (!libroActualizado) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    res.json({
      message: "Libro actualizado correctamente",
      data: libroActualizado,
    });
  } catch (error) {
    console.error("❌ Error en PUT /libros/:id:", error);

    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta PUT ppor :id para cambiar activo de true a false
api.put("/libros/:id/desactivar", async (req, res) => {
  console.log("PUT /libros/:id/desactivar", req.params);
  const { id } = req.params;

  try {
    const libroDesactivado = await desactivarLibro(id);

    if (!libroDesactivado) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    res.json({
      message: "Libro desactivado correctamente",
      data: libroDesactivado,
    });
  } catch (error) {
    console.error("❌ Error en PUT /libros/:id/desactivar:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET /carrito
api.get("/carrito/:id_cliente", async (req, res) => {
  console.log("GET /carrito", req.params);
  const { id_cliente } = req.params;

  try {
    const carrito = await getCarrito(id_cliente);

    const total = carrito.reduce((acc, item) => acc + Number(item.subtotal), 0);

    res.json({
      cantidad_items: carrito.length,
      total,
      data: carrito,
    });
  } catch (error) {
    console.error("❌ Error en GET /carrito:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST /carrito (agregar libro al carrito)
api.post("/carrito/:id_cliente/libros", async (req, res) => {
  console.log("POST /carrito/:id_cliente/libros", req.params, req.body);
  const { id_cliente } = req.params;
  const { id_libro, cantidad = 1 } = req.body;

  try {
    if (!id_libro) {
      return res.status(400).json({
        message: "El id_libro es obligatorio",
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        message: "La cantidad debe ser mayor a 0",
      });
    }

    const item = await agregarLibroCarrito(id_cliente, id_libro, cantidad);

    res.status(201).json({
      message: "Libro agregado al carrito",
      data: item,
    });
  } catch (error) {
    console.error("❌ Error en POST /carrito:", error);
    res.status(error.code || 500).json({
    error: error.code,
    message: error.message,
  });
  }
});

// Ruta PUT /carrito (actualizar cantidad de un libro en el carrito)
api.put("/carrito/:id_cliente/libros/:id_libro", async (req, res) => {
  console.log("PUT /carrito/:id_cliente/libros/:id_libro", req.params, req.body);
  const { id_cliente, id_libro } = req.params;
  const { cantidad } = req.body;

  try {
    if (cantidad === undefined) {
      return res.status(400).json({
        message: "La cantidad es obligatoria",
      });
    }

    const item = await actualizarCantidadCarrito(
      id_cliente,
      id_libro,
      cantidad,
    );

    if (!item) {
      return res.status(404).json({
        message: "Libro no encontrado en el carrito",
      });
    }

    res.json({
      message:
        cantidad <= 0 ? "Libro eliminado del carrito" : "Cantidad actualizada",
      data: item,
    });
  } catch (error) {
    console.error("❌ Error en PUT /carrito:", error);
    res.status(error.code || 500).json({
    error: error.code,
    message: error.message,
  });
  }
});

// Ruta DELETE /carrito (eliminar un libro del carrito)
api.delete("/carrito/:id_cliente/libros/:id_libro", async (req, res) => {
  console.log("DELETE /carrito/:id_cliente/libros/:id_libro", req.params);
  const { id_cliente, id_libro } = req.params;

  try {
    const item = await eliminarLibroCarrito(id_cliente, id_libro);

    if (!item) {
      return res.status(404).json({
        message: "Libro no encontrado en el carrito",
      });
    }

    res.json({
      message: "Libro eliminado del carrito",
      data: item,
    });
  } catch (error) {
    console.error("❌ Error en DELETE /carrito/libro:", error);
    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE /carrito (vaciar carrito completo) o hacer pedido
api.delete("/carrito/:id_cliente", async (req, res) => {
  console.log("DELETE /carrito/:id_cliente", req.params);
  const { id_cliente } = req.params;

  try {
    await vaciarCarrito(id_cliente);

    res.json({
      message: "Carrito vaciado correctamente",
    });
  } catch (error) {
    console.error("❌ Error en DELETE /carrito:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta GET /favoritos/:id_cliente (obtener lista de favoritos)
api.get("/favoritos/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;
  console.log("GET /favoritos/:id_cliente", req.params);

  try {
    const favoritos = await getFavoritos(id_cliente);

    res.json({
      cantidad: favoritos.length,
      data: favoritos,
    });
  } catch (error) {
    console.error("❌ Error en GET /favoritos:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta POST /favoritos/:id_cliente (agregar libro a favoritos)
api.post("/favoritos/:id_cliente", async (req, res) => {
  console.log("POST /favoritos/:id_cliente", req.params, req.body);
  const { id_cliente } = req.params;
  const { id_libro } = req.body;

  try {
    if (!id_libro) {
      return res.status(400).json({
        message: "id_libro es obligatorio",
      });
    }

    const favorito = await agregarFavorito(id_cliente, id_libro);

    if (!favorito) {
      return res.json({
        message: "El libro ya estaba en favoritos",
      });
    }

    res.status(201).json({
      message: "Libro agregado a favoritos",
      data: favorito,
    });
  } catch (error) {
    console.error("❌ Error en POST /favoritos:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET /preventas
api.get("/preventas", async (req, res) => {
  try {
    const preventas = await getPreventas();

    res.json({
      cantidad: preventas.length,
      data: preventas,
    });
  } catch (error) {
    console.error("❌ Error en GET /preventas:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta DELETE /favoritos/:id_cliente/:id_libro (eliminar libro de favoritos)
api.delete("/favoritos/:id_cliente/:id_libro", async (req, res) => {
  console.log("DELETE /favoritos/:id_cliente/:id_libro", req.params);
  const { id_cliente, id_libro } = req.params;

  try {
    const favorito = await eliminarFavorito(id_cliente, id_libro);

    if (!favorito) {
      return res.status(404).json({
        message: "Favorito no encontrado",
      });
    }

    res.json({
      message: "Favorito eliminado correctamente",
      data: favorito,
    });
  } catch (error) {
    console.error("❌ Error en DELETE /favoritos:", error);

    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET para lista de generos
api.get("/generos", async (req, res) => {
  try {
    const generos = await getGeneros();

    res.json({
      cantidad: generos.length,
      data: generos,
    });
  } catch (error) {
    console.error("❌ Error en GET /generos:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET direcciones de un cliente
api.get("/direcciones/:id_cliente", async (req, res) => {
  console.log("GET /direcciones/:id_cliente", req.params);

  const { id_cliente } = req.params;

  try {
    const direcciones = await getDireccionesCliente(id_cliente);

    res.json({
      cantidad: direcciones.length,
      data: direcciones,
    });
  } catch (error) {
    console.error("❌ Error en GET /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST crear dirección
api.post("/direcciones/:id_cliente", async (req, res) => {
  console.log("POST /direcciones/:id_cliente", {
    params: req.params,
    body: req.body,
  });

  const { id_cliente } = req.params;

  try {
    const {
      alias,
      destinatario,
      telefono,
      pais,
      ciudad,
      calle,
      numero,
    } = req.body;

    if (!alias || !destinatario || !telefono || !pais || !ciudad || !calle || !numero) {
      return res.status(400).json({
        message: "Alias, destinatario, teléfono, país, ciudad, calle y número son obligatorios",
      });
    }

    const nuevaDireccion = await crearDireccion(id_cliente, req.body);

    res.status(201).json({
      message: "Dirección creada correctamente",
      data: nuevaDireccion,
    });
  } catch (error) {
    console.error("❌ Error en POST /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta PUT actualizar dirección
api.put("/direcciones/:id_direccion", async (req, res) => {
  console.log("PUT /direcciones/:id_direccion", {
    params: req.params,
    body: req.body,
  });

  const { id_direccion } = req.params;

  try {
    const direccionActualizada = await actualizarDireccion(id_direccion, req.body);

    if (!direccionActualizada) {
      return res.status(404).json({
        message: "Dirección no encontrada",
      });
    }

    res.json({
      message: "Dirección actualizada correctamente",
      data: direccionActualizada,
    });
  } catch (error) {
    console.error("❌ Error en PUT /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE eliminar dirección
api.delete("/direcciones/:id_direccion", async (req, res) => {
  console.log("DELETE /direcciones/:id_direccion", req.params);

  const { id_direccion } = req.params;

  try {
    const direccionEliminada = await eliminarDireccion(id_direccion);

    if (!direccionEliminada) {
      return res.status(404).json({
        message: "Dirección no encontrada",
      });
    }

    res.json({
      message: "Dirección eliminada correctamente",
      data: direccionEliminada,
    });
  } catch (error) {
    console.error("❌ Error en DELETE /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET empresas de envío
api.get("/empresas-envio", async (req, res) => {
  console.log("GET /empresas-envio");

  try {
    const empresas = await getEmpresasEnvio();

    res.json({
      cantidad: empresas.length,
      data: empresas,
    });
  } catch (error) {
    console.error("❌ Error en GET /empresas-envio:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST crear empresa de envío
api.post("/empresas-envio", async (req, res) => {
  console.log("POST /empresas-envio", req.body);

  try {
    const { nombre, telefono } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: "El nombre de la empresa de envío es obligatorio",
      });
    }

    const nuevaEmpresa = await crearEmpresaEnvio({
      nombre,
      telefono,
    });

    res.status(201).json({
      message: "Empresa de envío creada correctamente",
      data: nuevaEmpresa,
    });
  } catch (error) {
    console.error("❌ Error en POST /empresas-envio:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

api.post("/pedidos/:id_cliente", async (req, res) => {
  console.log("POST /pedidos/:id_cliente", {
    params: req.params,
    body: req.body,
  });

  const { id_cliente } = req.params;
  const { id_direccion, id_empresa_envio } = req.body;

  try {
    if (!id_direccion || !id_empresa_envio) {
      return res.status(400).json({
        message: "id_direccion e id_empresa_envio son obligatorios",
      });
    }

    const pedido = await crearPedidoDesdeCarrito(
      id_cliente,
      id_direccion,
      id_empresa_envio
    );

    res.status(201).json({
      message: "Pedido creado correctamente",
      data: pedido,
    });
  } catch (error) {
    console.error("❌ Error en POST /pedidos:", error);

    const statusCode = typeof error.code === "number" ? error.code : 500;

    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

api.get("/pedidos/:id_cliente", async (req, res) => {
  console.log("GET /pedidos/:id_cliente", req.params);

  const { id_cliente } = req.params;

  try {
    const pedidos = await getPedidosCliente(id_cliente);

    res.json({
      cantidad: pedidos.length,
      data: pedidos,
    });
  } catch (error) {
    console.error("❌ Error en GET /pedidos:", error);

    const statusCode = typeof error.code === "number" ? error.code : 500;

    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

api.get("/pedidos/detalle/:id_pedido", async (req, res) => {
  console.log("GET /pedidos/detalle/:id_pedido", req.params);

  const { id_pedido } = req.params;

  try {
    const detalle = await getDetallePedido(id_pedido);

    res.json({
      cantidad: detalle.length,
      data: detalle,
    });
  } catch (error) {
    console.error("❌ Error en GET /pedidos/detalle:", error);

    const statusCode = typeof error.code === "number" ? error.code : 500;

    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

api.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});