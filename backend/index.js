const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./database/db");
const jwt = require("jsonwebtoken");
const { authMiddleware, verificarAdmin } = require("./middlewares/auth");
const { getHealth } = require("./database/db.js");
const {
  registrarCliente,
  loginCliente,
  actualizarCliente,
  obtenerTodosLosClientes,
  cambiarRolCliente,
  eliminarCliente,
} = require("./consultas/clientes.js");

const { obtenerOCrearEditorial } = require("./consultas/editoriales");
const { obtenerOCrearAutor } = require("./consultas/autores.js");
const { getGeneros, obtenerOCrearGenero } = require("./consultas/generos.js");
const { buscarLibroGoogleBooks } = require("./consultas/googleBooks.js");
const { buscarLibroOpenLibrary } = require("./consultas/openLibrary.js");
const { traducirTexto } = require("./consultas/traductor.js");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
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
  obtenerTodosLosPedidos,
  obtenerResumenPedido,
} = require("./consultas/pedidos.js");
const {
  obtenerClientes,
  obtenerClientePorId,
  actualizarRolCliente,
  eliminarCliente: eliminarClienteAdmin,
} = require("./consultas/gestion_usuarios");

const {
  registrarActividadAdmin,
  obtenerHistorialAdmin,
} = require("./consultas/historial_admin");

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
api.get("/", (req, res) => {
  res.send("API libreria funcionando");
});

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

//RUTA POST para actualizar perfil del cliente autenticado
// PUT /clientes/me — actualizar perfil del cliente autenticado
api.put("/clientes/me", authMiddleware, async (req, res) => {
  const id_cliente = req.user.id_cliente;
  const { nombre, email, password } = req.body;

  try {
    const clienteActualizado = await actualizarCliente(id_cliente, {
      nombre,
      email,
      password,
    });

    res.json({
      message: "Perfil actualizado con éxito",
      data: clienteActualizado,
    });
  } catch (error) {
    console.error("Error en PUT /clientes/me:", error);
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
});

// GET /clientes — listar todos (solo admin)
api.get("/clientes", authMiddleware, verificarAdmin, async (req, res) => {
  try {
    const clientes = await obtenerTodosLosClientes();
    res.json({ data: clientes });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message });
  }
});

// PUT /clientes/:id_cliente/rol — cambiar rol (solo admin)
api.put(
  "/clientes/:id_cliente/rol",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    const { id_cliente } = req.params;
    const { rol } = req.body;

    if (!["admin", "cliente"].includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    try {
      const cliente = await cambiarRolCliente(id_cliente, rol);
      res.json({ message: "Rol actualizado", data: cliente });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  },
);

// DELETE /clientes/:id_cliente — eliminar usuario (solo admin)
api.delete(
  "/clientes/:id_cliente",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    const { id_cliente } = req.params;

    try {
      const cliente = await eliminarCliente(id_cliente);
      res.json({ message: "Usuario eliminado", data: cliente });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  },
);

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
        message: "El descuento debe ser un valor entre 0 y 100",
      });
    }

    const libroExistente = await obtenerLibroByIsbn(isbn);

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

    await registrarActividadAdmin({
      id_admin: req.user.id_cliente,
      nombre_admin: req.user.email,
      accion: "CREAR_LIBRO",
      detalle: `Libro creado: ${titulo}`,
      ruta: req.originalUrl,
      ip: req.ip,
    });

    res.status(201).json({
      message: "Libro creado con exito",
      data: nuevoLibro,
    });
  } catch (error) {
    console.error("Error en POST /libros:", error);
    res.status(500).json({
      error: error.code,
      message: error.message,
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
    if (precio !== undefined && precio < 0) {
      return res
        .status(400)
        .json({ message: "El precio no puede ser negativo" });
    }
    if (stock !== undefined && stock < 0) {
      return res
        .status(400)
        .json({ message: "El stock no puede ser negativo" });
    }
    if (descuento !== undefined && (descuento < 0 || descuento > 100)) {
      return res
        .status(400)
        .json({ message: "El descuento debe estar entre 0 y 100" });
    }

    const libroActualizado = await actualizarLibro(id, {
      precio,
      stock,
      descuento,
      titulo,
      descripcion,
      imagen,
      formato,
    });

    if (!libroActualizado) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Actualizar autores si vienen
    if (autores && autores.length > 0) {
      await pool.query(`DELETE FROM libro_autor WHERE id_libro = $1`, [id]);
      for (const nombreAutor of autores) {
        const id_autor = await obtenerOCrearAutor(nombreAutor);
        await agregarAutorLibro(id, id_autor);
      }
    }

    // Actualizar géneros si vienen
    if (generos && generos.length > 0) {
      await pool.query(`DELETE FROM libro_genero WHERE id_libro = $1`, [id]);
      for (const nombreGenero of generos) {
        const id_genero = await obtenerOCrearGenero(nombreGenero);
        await agregarGeneroLibro(id, id_genero);
      }
    }

    await registrarActividadAdmin({
      id_admin: req.user.id_cliente,
      nombre_admin: req.user.email,
      accion: "ACTUALIZAR_LIBRO",
      detalle: `Libro actualizado: ID ${id}`,
      ruta: req.originalUrl,
      ip: req.ip,
    });

    res.json({
      message: "Libro actualizado con exito",
      data: libroActualizado,
    });
  } catch (error) {
    console.error("Error en PUT /libros/:id:", error);
    res.status(500).json({ error: error.code, message: error.message });
  }
});

// Ruta PUT ppor :id para cambiar activo de true a false
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

      await registrarActividadAdmin({
        id_admin: req.user.id_cliente,
        nombre_admin: req.user.email,
        accion: "DESACTIVAR_LIBRO",
        detalle: `Libro desactivado: ${libroDesactivado.titulo}`,
        ruta: req.originalUrl,
        ip: req.ip,
      });

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
    console.log("Preventas encontradas:", Preventas.length);

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

api.get(
  "/pedidos/admin/todos",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    try {
      const pedidos = await obtenerTodosLosPedidos();
      res.json({ data: pedidos });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener ventas" });
    }
  },
);

api.get("/pedidos/resumen/:id_pedido", authMiddleware, async (req, res) => {
  try {
    const resumen = await obtenerResumenPedido(req.params.id_pedido);
    if (!resumen)
      return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ data: resumen });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener resumen del pedido" });
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

api.get("/clientes", authMiddleware, verificarAdmin, async (req, res) => {
  const { busqueda, rol } = req.query;

  try {
    const clientes = await obtenerClientes(busqueda, rol);

    res.json({
      cantidad: clientes.length,
      data: clientes,
    });
  } catch (error) {
    console.error("Error en GET /clientes:", error);
    res.status(500).json({
      message: "Error interno al obtener clientes",
    });
  }
});

api.get("/clientes/:id", authMiddleware, verificarAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(Number(id))) {
      return res.status(400).json({
        message: "El id del cliente debe ser numérico",
      });
    }

    const cliente = await obtenerClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente no encontrado",
      });
    }

    res.json({
      data: cliente,
    });
  } catch (error) {
    console.error("Error en GET /clientes/:id:", error);
    res.status(500).json({
      message: "Error interno al obtener cliente",
    });
  }
});

api.put(
  "/clientes/:id/rol",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { rol } = req.body;

    try {
      const rolesPermitidos = ["cliente", "admin"];

      if (isNaN(Number(id))) {
        return res.status(400).json({
          message: "El id del cliente debe ser numérico",
        });
      }

      if (Number(id) === Number(req.user.id_cliente)) {
        return res.status(400).json({
          message: "No puedes modificar tu propio rol",
        });
      }

      if (!rol || !rolesPermitidos.includes(rol.toLowerCase())) {
        return res.status(400).json({
          message: "Rol inválido. Usa cliente o admin",
        });
      }

      const clienteActualizado = await actualizarRolCliente(
        id,
        rol.toLowerCase(),
      );

      if (!clienteActualizado) {
        return res.status(404).json({
          message: "Cliente no encontrado",
        });
      }

      await registrarActividadAdmin({
        id_admin: req.user.id_cliente,
        nombre_admin: req.user.email,
        accion: "CAMBIAR_ROL_CLIENTE",
        detalle: `Cliente ${clienteActualizado.email} cambiado a rol: ${clienteActualizado.rol}`,
        ruta: req.originalUrl,
        ip: req.ip,
      });

      res.json({
        message: "Rol actualizado con éxito",
        data: clienteActualizado,
      });
    } catch (error) {
      console.error("Error en PUT /clientes/:id/rol:", error);
      res.status(500).json({
        message: "Error interno al actualizar rol",
      });
    }
  },
);

api.delete(
  "/clientes/:id",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      if (isNaN(Number(id))) {
        return res.status(400).json({
          message: "El id del cliente debe ser numérico",
        });
      }

      if (Number(id) === Number(req.user.id_cliente)) {
        return res.status(400).json({
          message: "No puedes eliminar tu propio usuario",
        });
      }

      const clienteEliminado = await eliminarClienteAdmin(id);

      if (!clienteEliminado) {
        return res.status(404).json({
          message: "Cliente no encontrado",
        });
      }

      await registrarActividadAdmin({
        id_admin: req.user.id_cliente,
        nombre_admin: req.user.email,
        accion: "DESACTIVAR_CLIENTE",
        detalle: `Cliente desactivado: ${clienteEliminado.email}`,
        ruta: req.originalUrl,
        ip: req.ip,
      });

      res.json({
        message: "Cliente eliminado con éxito",
        data: clienteEliminado,
      });
    } catch (error) {
      console.error("Error en DELETE /clientes/:id:", error);
      res.status(500).json({
        message: "Error interno al eliminar cliente",
      });
    }
  },
);

// GET historial administrativo
api.get(
  "/historial-admin",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    const { admin, accion, desde, hasta } = req.query;

    try {
      const historial = await obtenerHistorialAdmin({
        admin,
        accion,
        desde,
        hasta,
      });

      res.json({
        cantidad: historial.length,
        data: historial,
      });
    } catch (error) {
      console.error("Error en GET /historial-admin:", error);

      res.status(500).json({
        message: "Error interno al obtener historial administrativo",
      });
    }
  },
);

// GET exportar historial administrativo en Excel
api.get(
  "/historial-admin/excel",
  authMiddleware,
  verificarAdmin,
  async (req, res) => {
    try {
      const { admin, accion, desde, hasta } = req.query;

      const historial = await obtenerHistorialAdmin({
        admin,
        accion,
        desde,
        hasta,
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Historial Admin");

      worksheet.columns = [
        { header: "ID", key: "id_historial", width: 10 },
        { header: "Fecha", key: "fecha", width: 25 },
        { header: "Administrador", key: "nombre_admin", width: 30 },
        { header: "Acción", key: "accion", width: 25 },
        { header: "Detalle", key: "detalle", width: 50 },
        { header: "Ruta", key: "ruta", width: 30 },
        { header: "IP", key: "ip", width: 25 },
      ];

      historial.forEach((item) => {
        worksheet.addRow({
          id_historial: item.id_historial,
          fecha: item.fecha,
          nombre_admin: item.nombre_admin,
          accion: item.accion,
          detalle: item.detalle,
          ruta: item.ruta,
          ip: item.ip,
        });
      });

      worksheet.getRow(1).font = { bold: true };

      const fechaActual = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\..+/, "");

      const nombreArchivo = `historial_admin_${fechaActual}.xlsx`;

      const rutaArchivo = path.join(
        __dirname,
        "reportes",
        "historial_admin",
        nombreArchivo,
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${nombreArchivo}`,
      );

      await workbook.xlsx.writeFile(rutaArchivo);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error en GET /historial-admin/excel:", error);

      res.status(500).json({
        message: "Error interno al exportar historial administrativo",
      });
    }
  },
);

if (require.main === module) {
  api.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}

module.exports = api;
