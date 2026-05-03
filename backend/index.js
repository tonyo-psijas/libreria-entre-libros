const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { getHealth } = require("./database/db.js");
const {
  getLibros,
  getLibroById,
  updateDescuento,
} = require("./consultas/libros.js");
const { filtrarLibros, getLibroByIsbn } = require("./consultas/libros.js");
const { crearLibro } = require("./consultas/libros.js");
const { obtenerOCrearEditorial } = require("./consultas/editoriales");
const { obtenerOCrearAutor } = require("./consultas/autores.js");
const { obtenerOCrearGenero } = require("./consultas/generos.js");
const { desactivarLibro, actualizarLibro } = require("./consultas/libros.js");
const { buscarLibroGoogleBooks } = require("./consultas/googleBooks.js");
const { buscarLibroOpenLibrary } = require("./consultas/openLibrary.js");
const { traducirTexto } = require("./consultas/traductor.js");
const {
  getCarrito,
  agregarLibroCarrito,
  actualizarCantidadCarrito,
  eliminarLibroCarrito,
  vaciarCarrito,
} = require("./consultas/carrito.js");
const {
  getFavoritos,
  agregarFavorito,
  eliminarFavorito,
} = require("./consultas/favoritos.js");

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

api.get("/libros", async (req, res) => {
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

api.get("/libros/filtros", async (req, res) => {
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

api.get("/libros/buscar-isbn/:isbn", async (req, res) => {
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

api.get("/libros/:id", async (req, res) => {
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

api.post("/libros", async (req, res) => {
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

api.put("/libros/:id", async (req, res) => {
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

api.put("/libros/:id/desactivar", async (req, res) => {
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
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta PUT /carrito (actualizar cantidad de un libro en el carrito)
api.put("/carrito/:id_cliente/libros/:id_libro", async (req, res) => {
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
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE /carrito (eliminar un libro del carrito)
api.delete("/carrito/:id_cliente/libros/:id_libro", async (req, res) => {
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
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// Ruta DELETE /carrito (vaciar carrito completo) o hacer pedido
api.delete("/carrito/:id_cliente", async (req, res) => {
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

  try {
    const favoritos = await getFavoritos(id_cliente);

    res.json({
      cantidad: favoritos.length,
      data: favoritos,
    });
  } catch (error) {
    console.error("❌ Error en GET /favoritos:", error);

    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta POST /favoritos/:id_cliente (agregar libro a favoritos)
api.post("/favoritos/:id_cliente", async (req, res) => {
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

    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

// ruta DELETE /favoritos/:id_cliente/:id_libro (eliminar libro de favoritos)
api.delete("/favoritos/:id_cliente/:id_libro", async (req, res) => {
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

api.listen(PORT, () => {
  //console.log("Server started on http://localhost:"+ process.env.PORT || 3000)
  console.log(`Servidor en http://localhost:${PORT}`);
});
