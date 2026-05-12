const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./database/db");
const jwt = require("jsonwebtoken");
const { authMiddleware, verificarAdmin } = require("./middlewares/auth");
const { getHealth } = require("./database/db.js");
const { registrarCliente, loginCliente } = require("./consultas/clientes.js");
const { obtenerOCrearEditorial } = require("./consultas/editoriales");
const { obtenerOCrearAutor } = require("./consultas/autores.js");
const { getGeneros, obtenerOCrearGenero } = require("./consultas/generos.js");
const { buscarLibroGoogleBooks } = require("./consultas/googleBooks.js");
const { buscarLibroOpenLibrary } = require("./consultas/openLibrary.js");
const { traducirTexto } = require("./consultas/traductor.js");
const {
  obtenerLibros,
  obtenerLibroById,
  updateDescuento,
  filtrarLibros,
  obtenerLibroByIsbn,
  buscarLibros,
  crearLibro,
  desactivarLibro,
  actualizarLibro,
  agregarAutorLibro,
  agregarGeneroLibro,
  obtenerPreventas,
} = require("./consultas/libros.js");
const {
  obtenerCarrito,
  agregarLibroCarrito,
  actualizarCantidadCarrito,
  eliminarLibroCarrito,
  vaciarCarrito,
} = require("./consultas/carrito.js");
const {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
} = require("./consultas/favoritos.js");
const {
  obtenerDireccionesCliente,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
} = require("./consultas/direcciones.js");
const {
  obtenerEmpresasEnvio,
  crearEmpresaEnvio,
} = require("./consultas/empresasEnvio.js");
const {
  crearPedidoDesdeCarrito,
  obtenerPedidosCliente,
  obtenerDetallePedido,
} = require("./consultas/pedidos.js");

if (require.main === module) {
  getHealth();
}

const api = express();

//Middlewares
api.use(express.json());
api.use(cors());

// Puerto donde escucha el back
const PORT = process.env.PORT || 3000;

// Ruta de prueba del servidor
// api.get("/", (req, res) => {
//   res.send("API libreria funcionando");
// });

// Ruta POST para registrar clientes
api.post("/clientes/register", async (req, res) => {
  try {
    const cliente = await registrarCliente(req.body);

    const token = jwt.sign(
      {
        id_cliente: cliente.id_cliente,
        email: cliente.email,
        rol: cliente.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      message: "Cliente registrado con éxito",
      cliente,
      token,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
});

// Ruta POST para login de clientes
api.post("/clientes/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cliente = await loginCliente(email, password);

    const token = jwt.sign(
      {
        id_cliente: cliente.id_cliente,
        email: cliente.email,
        rol: cliente.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login exitoso",
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        email: cliente.email,
        rol: cliente.rol,
      },
      token,
    });
  } catch (error) {
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
});

//Ruta Get para obtener todos los libros activos
api.get("/libros", async (req, res) => {
  console.log("GET /libros");
  try {
    const libros = await obtenerLibros();
    res.json(libros);
  } catch (error) {
    console.error("Error en GET /libros:", error);
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
    console.error("Error en GET /libros/buscar:", error);
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
    console.error("Error en GET /libros/filtros:", error);
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
    const libroBD = await obtenerLibroByIsbn(isbn);

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
          (libroOpenLibrary.generos || []).map((genero) =>
            traducirTexto(genero),
          ),
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
    console.error("Error en GET /libros/buscar-isbn:", error);

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
    const libro = await obtenerLibroById(id);

    if (!libro) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }
    res.json(libro);
  } catch (error) {
    console.error("Error en GET /libros/:id:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST para crear un nuevo libro
api.post("/libros", authMiddleware, verificarAdmin, async (req, res) => {
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

    const formatosPermitidos = ["fisico", "físico", "digital", "preventa"];

    if (!titulo?.trim() || !isbn?.trim() || precio === undefined) {
      return res.status(400).json({
        message: "Título, ISBN y precio son obligatorios",
      });
    }

    if (!editorial?.trim()) {
      return res.status(400).json({
        message: "La editorial es obligatoria",
      });
    }

    if (isNaN(Number(precio)) || Number(precio) <= 0) {
      return res.status(400).json({
        message: "El precio debe ser un número mayor a 0",
      });
    }

    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({
        message: "El stock debe ser un número igual o mayor a 0",
      });
    }

    if (
      isNaN(Number(descuento)) ||
      Number(descuento) < 0 ||
      Number(descuento) > 100
    ) {
      return res.status(400).json({
        message: "El descuento debe ser un valor entre 0 y 100",
      });
    }

    if (!formato || !formatosPermitidos.includes(formato.toLowerCase())) {
      return res.status(400).json({
        message: "Formato inválido. Usa fisico, físico, digital o preventa",
      });
    }

    if (!Array.isArray(autores) || !Array.isArray(generos)) {
      return res.status(400).json({
        message: "Autores y géneros deben ser arreglos",
      });
    }

    const libroExistente = await obtenerLibroByIsbn(isbn.trim());

    if (libroExistente) {
      return res.status(400).json({
        message: "Ya existe un libro registrado con ese ISBN",
      });
    }

    const id_editorial = await obtenerOCrearEditorial(editorial.trim());

    const nuevoLibro = await crearLibro({
      titulo: titulo.trim(),
      isbn: isbn.trim(),
      descripcion,
      precio: Number(precio),
      descuento: Number(descuento),
      formato: formato.toLowerCase(),
      stock: Number(stock),
      id_editorial,
      fecha_publicacion,
      numero_paginas,
      imagen,
    });

    const autoresLimpios = autores.filter((a) => a?.trim());
    const generosLimpios = generos.filter((g) => g?.trim());

    for (const nombreAutor of autoresLimpios) {
      const id_autor = await obtenerOCrearAutor(nombreAutor.trim());
      await agregarAutorLibro(nuevoLibro.id_libro, id_autor);
    }

    for (const nombreGenero of generosLimpios) {
      const id_genero = await obtenerOCrearGenero(nombreGenero.trim());
      await agregarGeneroLibro(nuevoLibro.id_libro, id_genero);
    }

    res.status(201).json({
      message: "Libro creado con exito",
      data: nuevoLibro,
    });
  } catch (error) {
    console.error("Error en POST /libros:", error);
    res.status(500).json({
      message: "Error interno al crear el libro",
    });
  }
});

// Ruta PUT para actualizar un libro por ID
api.put("/libros/:id", authMiddleware, verificarAdmin, async (req, res) => {
  const { id } = req.params;

  const {
    precio,
    stock,
    descuento,
    titulo,
    descripcion,
    imagen,
    formato,
    autores,
    generos,
  } = req.body;

  try {
    const formatosPermitidos = ["fisico", "físico", "digital", "preventa"];

    if (isNaN(Number(id))) {
      return res.status(400).json({
        message: "El id del libro debe ser numérico",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Debes enviar al menos un campo para actualizar",
      });
    }

    if (precio !== undefined && (isNaN(Number(precio)) || Number(precio) <= 0)) {
      return res.status(400).json({
        message: "El precio debe ser un número mayor a 0",
      });
    }

    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({
        message: "El stock debe ser un número igual o mayor a 0",
      });
    }

    if (
      descuento !== undefined &&
      (isNaN(Number(descuento)) ||
        Number(descuento) < 0 ||
        Number(descuento) > 100)
    ) {
      return res.status(400).json({
        message: "El descuento debe estar entre 0 y 100",
      });
    }

    if (
      formato !== undefined &&
      !formatosPermitidos.includes(formato.toLowerCase())
    ) {
      return res.status(400).json({
        message: "Formato inválido. Usa fisico, físico, digital o preventa",
      });
    }

    if (autores !== undefined && !Array.isArray(autores)) {
      return res.status(400).json({
        message: "Autores debe ser un arreglo",
      });
    }

    if (generos !== undefined && !Array.isArray(generos)) {
      return res.status(400).json({
        message: "Géneros debe ser un arreglo",
      });
    }

    const libroActualizado = await actualizarLibro(id, {
      precio: precio !== undefined ? Number(precio) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      descuento: descuento !== undefined ? Number(descuento) : undefined,
      titulo: titulo?.trim(),
      descripcion,
      imagen: imagen?.trim(),
      formato: formato?.trim().toLowerCase(),
    });

    if (!libroActualizado) {
      return res.status(404).json({
        message: "Libro no encontrado",
      });
    }

    if (autores !== undefined) {
      await pool.query(`DELETE FROM libro_autor WHERE id_libro = $1`, [id]);

      const autoresLimpios = autores.filter((a) => a?.trim());

      for (const nombreAutor of autoresLimpios) {
        const id_autor = await obtenerOCrearAutor(nombreAutor.trim());
        await agregarAutorLibro(id, id_autor);
      }
    }

    if (generos !== undefined) {
      await pool.query(`DELETE FROM libro_genero WHERE id_libro = $1`, [id]);

      const generosLimpios = generos.filter((g) => g?.trim());

      for (const nombreGenero of generosLimpios) {
        const id_genero = await obtenerOCrearGenero(nombreGenero.trim());
        await agregarGeneroLibro(id, id_genero);
      }
    }

    res.json({
      message: "Libro actualizado con exito",
      data: libroActualizado,
    });
  } catch (error) {
    console.error("Error en PUT /libros/:id:", error);
    res.status(500).json({
      message: "Error interno al actualizar el libro",
    });
  }
});

// Ruta PUT por :id para cambiar activo de true a false
api.put(
  "/libros/:id/desactivar",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
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
        message: "Libro desactivado con exito",
        data: libroDesactivado,
      });
    } catch (error) {
      console.error("Error en PUT /libros/:id/desactivar:", error);

      res.status(error.code || 500).json({
        error: error.code,
        message: error.message,
      });
    }
  },
);

// Ruta GET /carrito
api.get("/carrito", authMiddleware, async (req, res) => {
  console.log("GET /carrito", req.params);
  const id_cliente = req.user.id_cliente;

  try {
    const carrito = await obtenerCarrito(id_cliente);

    const total = carrito.reduce((acc, item) => acc + Number(item.subtotal), 0);

    res.json({
      cantidad_items: carrito.length,
      total,
      data: carrito,
    });
  } catch (error) {
    console.error("Error en GET /carrito:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST /carrito (agregar libro al carrito)
api.post("/carrito", authMiddleware, async (req, res) => {
  //console.log("POST /carrito", req.body);
  const { id_libro, cantidad = 1 } = req.body;
  const id_cliente = req.user.id_cliente;

  try {
    if (!id_libro) {
      return res.status(400).json({
        message: "El id_libro es obligatorio",
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        message: "La cantidad debe ser al menos de 1 libro",
      });
    }

    const item = await agregarLibroCarrito(id_cliente, id_libro, cantidad);

    res.status(201).json({
      message: "Libro agregado al carrito",
      data: item,
    });
  } catch (error) {
    console.error("Error POST /carrito:", error);

    res.status(Number.isInteger(error.code) ? error.code : 500).json({
      message: error.message,
    });
  }
});

// Ruta PUT /carrito (actualizar cantidad de un libro en el carrito)
api.put("/carrito/:id_libro", authMiddleware, async (req, res) => {
  console.log(
    "PUT /carrito/:id_cliente/libros/:id_libro",
    req.params,
    req.body,
  );
  const id_cliente = req.user.id_cliente;
  const { id_libro } = req.params;
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

    res.json({
      message:
        cantidad <= 0 ? "Libro eliminado del carrito" : "Cantidad actualizada",
      data: item,
    });
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE /carrito (eliminar un libro del carrito)
api.delete("/carrito/:id_libro", authMiddleware, async (req, res) => {
  console.log("DELETE /carrito/:id_cliente/libros/:id_libro", req.params);
  const id_cliente = req.user.id_cliente;
  const { id_libro } = req.params;

  try {
    const item = await eliminarLibroCarrito(id_cliente, id_libro);

    if (!item) {
      return res.status(404).json({
        message: "El Libro no se encuentra en el carrito",
      });
    }

    res.json({
      message: "Libro eliminado del carrito",
      data: item,
    });
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE /carrito (vaciar carrito completo) o hacer pedido
api.delete("/carrito", authMiddleware, async (req, res) => {
  console.log("DELETE /carrito", req.params);
  const id_cliente = req.user.id_cliente;

  try {
    await vaciarCarrito(id_cliente);

    res.json({
      message: "Carrito vaciado con exito",
    });
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta GET /favoritos (obtener lista de favoritos)
api.get("/favoritos", authMiddleware, async (req, res) => {
  const id_cliente = req.user.id_cliente;
  console.log("GET /favoritos", req.params);

  try {
    const favoritos = await obtenerFavoritos(id_cliente);

    res.json({
      cantidad: favoritos.length,
      data: favoritos,
    });
  } catch (error) {
    console.error("Error en GET /favoritos:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta POST /favoritos/ (agregar libro a favoritos)
api.post("/favoritos", authMiddleware, async (req, res) => {
  console.log("POST /favoritos", req.params, req.body);
  const id_cliente = req.user.id_cliente;
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
        message: "El libro ya esta en favoritos",
      });
    }

    res.status(201).json({
      message: "Libro agregado a favoritos",
      data: favorito,
    });
  } catch (error) {
    console.error("Error en POST /favoritos:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta DELETE /favoritos (eliminar libro de favoritos)
api.delete("/favoritos", authMiddleware, async (req, res) => {
  console.log("DELETE /favoritos", req.params);
  const id_cliente = req.user.id_cliente;
  const { id_libro } = req.body;

  try {
    const favorito = await eliminarFavorito(id_cliente, id_libro);

    if (!favorito) {
      return res.status(404).json({
        message: "Favorito no encontrado",
      });
    }

    res.json({
      message: "Favorito eliminado con exito",
      data: favorito,
    });
  } catch (error) {
    console.error("Error en DELETE /favoritos:", error);

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
    console.error("Error en GET /generos:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET /Preventas
api.get("/preventas", async (req, res) => {
  try {
    const Preventas = await obtenerPreventas();

    res.json({
      cantidad: Preventas.length,
      data: Preventas,
    });
  } catch (error) {
    console.error("Error en GET /Preventas:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta GET direcciones de un cliente
api.get("/direcciones", authMiddleware, async (req, res) => {
  console.log("GET /direcciones/:id_cliente", req.params);

  const id_cliente = req.user.id_cliente;

  try {
    const direcciones = await obtenerDireccionesCliente(id_cliente);

    res.json({
      cantidad: direcciones.length,
      data: direcciones,
    });
  } catch (error) {
    console.error("Error en GET /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST crear dirección
api.post("/direcciones", authMiddleware, async (req, res) => {
  console.log("POST /direcciones", {
    params: req.params,
    body: req.body,
  });

  const id_cliente = req.user.id_cliente;

  try {
    const { alias, destinatario, telefono, pais, ciudad, calle, numero } =
      req.body;

    if (
      !alias ||
      !destinatario ||
      !telefono ||
      !pais ||
      !ciudad ||
      !calle ||
      !numero
    ) {
      return res.status(400).json({
        message:
          "Alias, destinatario, teléfono, país, ciudad, calle y número son obligatorios",
      });
    }

    const nuevaDireccion = await crearDireccion(id_cliente, req.body);

    res.status(201).json({
      message: "Dirección creada con exito",
      data: nuevaDireccion,
    });
  } catch (error) {
    console.error("Error en POST /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta PUT actualizar dirección
api.put("/direcciones/:id_direccion", authMiddleware, async (req, res) => {
  console.log("PUT /direcciones/:id_direccion", {
    params: req.params,
    body: req.body,
  });

  const { id_direccion } = req.params;

  try {
    const direccionActualizada = await actualizarDireccion(
      id_direccion,
      req.body,
    );

    if (!direccionActualizada) {
      return res.status(404).json({
        message: "Dirección no encontrada",
      });
    }

    res.json({
      message: "Dirección actualizada con exito",
      data: direccionActualizada,
    });
  } catch (error) {
    console.error("Error en PUT /direcciones:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE eliminar dirección
api.delete("/direcciones/:id_direccion", authMiddleware, async (req, res) => {
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
      message: "Dirección eliminada con exito",
      data: direccionEliminada,
    });
  } catch (error) {
    console.error("Error en DELETE /direcciones:", error);

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
    const empresas = await obtenerEmpresasEnvio();

    res.json({
      cantidad: empresas.length,
      data: empresas,
    });
  } catch (error) {
    console.error("Error en GET /empresas-envio:", error);

    res.status(error.code || 500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta POST crear empresa de envío
api.post(
  "/empresas-envio",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
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
        message: "Empresa de envío creada",
        data: nuevaEmpresa,
      });
    } catch (error) {
      console.error("Error en POST /empresas-envio:", error);

      res.status(error.code || 500).json({
        error: error.code,
        message: error.message,
      });
    }
  },
);

api.post("/pedidos", authMiddleware, async (req, res) => {
  console.log("POST /pedidos", {
    body: req.body,
  });

  const id_cliente = req.user.id_cliente;

  const { id_direccion, id_empresa_envio, id_metodo_pago } = req.body;

  try {
    if (!id_direccion || !id_empresa_envio || !id_metodo_pago) {
      return res.status(400).json({
        message:
          "id_direccion, id_empresa_envio e id_metodo_pago son obligatorios",
      });
    }

    const pedido = await crearPedidoDesdeCarrito(
      id_cliente,
      id_direccion,
      id_empresa_envio,
      id_metodo_pago,
    );

    res.status(201).json({
      message: "Pedido creado correctamente",
      data: pedido,
    });
  } catch (error) {
    console.error("Error en POST /pedidos:", error);

    const statusCode = typeof error.code === "number" ? error.code : 500;

    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

api.get("/pedidos", authMiddleware, async (req, res) => {
  console.log("GET /pedidos", req.params);

  const id_cliente = req.user.id_cliente;

  try {
    const pedidos = await obtenerPedidosCliente(id_cliente);

    res.json({
      cantidad: pedidos.length,
      data: pedidos,
    });
  } catch (error) {
    console.error("Error en GET /pedidos:", error);

    const statusCode = typeof error.code === "number" ? error.code : 500;

    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

api.get("/pedidos/detalle/:id_pedido", authMiddleware, async (req, res) => {
  console.log("GET /pedidos/detalle/:id_pedido", req.params);

  const { id_pedido } = req.params;

  try {
    const detalle = await obtenerDetallePedido(id_pedido);

    res.json({
      cantidad: detalle.length,
      data: detalle,
    });
  } catch (error) {
    console.error("Error en GET /pedidos/detalle:", error);

    const statusCode = typeof error.code === "number" ? error.code : 500;

    res.status(statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
});

if (require.main === module) {
  api.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = api;
