const pool = require("../database/db");

// RUTA GET /libros
const obtenerLibros = async () => {
  const { rows } = await pool.query(`
        SELECT 
            l.id_libro,
            l.titulo,
            l.precio,
            l.descuento,
            l.formato,
            TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
            l.imagen,
            STRING_AGG(DISTINCT a.nombre, ', ') AS autores
        FROM libro l
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        WHERE l.activo = true
        GROUP BY l.id_libro, l.titulo, l.precio, l.descuento, l.imagen, l.formato
        ORDER BY l.descuento DESC, l.id_libro ASC
    `);

  return rows;
};

// RUTA GET /libros con filtros
const filtrarLibros = async ({ titulo, autor, genero }) => {
  const { rows } = await pool.query(
    `
        SELECT DISTINCT
            l.id_libro,
            l.titulo,
            l.precio,
            l.descuento,
            l.formato,
            TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
            l.imagen,
            l.stock,
            l.activo,
            e.nombre AS editorial,
            STRING_AGG(DISTINCT a.nombre, ', ') AS autores
        FROM libro l
        LEFT JOIN editorial e ON l.id_editorial = e.id_editorial
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_genero lg ON l.id_libro = lg.id_libro
        LEFT JOIN genero g ON lg.id_genero = g.id_genero
        WHERE l.activo = true
        AND ($1::TEXT IS NULL OR LOWER(l.titulo) LIKE LOWER('%' || $1 || '%'))
        AND ($2::TEXT IS NULL OR LOWER(a.nombre) LIKE LOWER('%' || $2 || '%'))
        AND ($3::TEXT IS NULL OR LOWER(g.nombre) LIKE LOWER('%' || $3 || '%'))
        GROUP BY l.id_libro, l.titulo, l.precio, l.descuento, l.imagen, l.stock, e.nombre
        ORDER BY l.titulo ASC
    `,
    [titulo || null, autor || null, genero || null],
  );

  return rows;
};

// RUTA GET /libros/buscar-isbn/:isbn
const obtenerLibroByIsbn = async (isbn) => {
  const { rows } = await pool.query(
    `
        SELECT 
            id_libro,
            titulo,
            isbn,
            descripcion,
            precio,
            descuento,
            stock,
            formato,
            id_editorial,
            fecha_publicacion,
            numero_paginas,
            imagen,
            activo
        FROM libro
        WHERE isbn = $1
    `,
    [isbn],
  );

  return rows[0];
};

// RUTA GET /libros/:id
const obtenerLibroById = async (id) => {
  const { rows } = await pool.query(
    `
        SELECT 
            l.id_libro,
            l.titulo,
            l.descripcion,
            l.precio,
            l.descuento,
            l.formato,
            TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
            l.formato,
            l.stock,
            l.fecha_publicacion,
            l.numero_paginas,
            l.imagen,
            e.nombre AS editorial,
            STRING_AGG(DISTINCT a.nombre, ', ') AS autores,
            STRING_AGG(DISTINCT g.nombre, ', ') AS generos
        FROM libro l
        LEFT JOIN editorial e ON l.id_editorial = e.id_editorial
        LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
        LEFT JOIN autor a ON la.id_autor = a.id_autor
        LEFT JOIN libro_genero lg ON l.id_libro = lg.id_libro
        LEFT JOIN genero g ON lg.id_genero = g.id_genero
        WHERE l.id_libro = $1 AND l.activo = true
        GROUP BY l.id_libro, l.titulo, l.descripcion, l.precio, l.descuento,
                 l.formato, l.stock, l.fecha_publicacion, l.numero_paginas, l.imagen, e.nombre
    `,
    [id],
  );

  return rows[0];
};

// Ruta GET /libros/admin obtener todos los libros por un admin, incluyendo inactivos
const obtenerLibrosAdmin = async () => {
  const { rows } = await pool.query(`
    SELECT 
      l.id_libro,
      l.titulo,
      l.precio,
      l.descuento,
      l.formato,
      l.stock,
      l.activo,
      TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
      l.imagen,
      e.nombre AS editorial,
      STRING_AGG(DISTINCT a.nombre, ', ') AS autores
    FROM libro l
    LEFT JOIN editorial e ON l.id_editorial = e.id_editorial
    LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
    LEFT JOIN autor a ON la.id_autor = a.id_autor
    GROUP BY l.id_libro, e.nombre
    ORDER BY l.activo DESC, l.titulo ASC
  `);

  return rows;
};

// RUTA POST /libros (crear nuevo libro)
const crearLibro = async (libro) => {
  const {
    titulo,
    isbn,
    descripcion,
    precio,
    descuento = 0,
    formato,
    stock,
    id_editorial,
    fecha_publicacion,
    numero_paginas,
    imagen,
  } = libro;

  const { rows } = await pool.query(
    `
        INSERT INTO libro (
            titulo, isbn, descripcion, precio, descuento, formato,
            stock, id_editorial, fecha_publicacion, numero_paginas, imagen
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
    `,
    [
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
    ],
  );

  return rows[0];
};

const agregarAutorLibro = async (id_libro, id_autor) => {
  await pool.query(
    `
        INSERT INTO libro_autor (id_libro, id_autor)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `,
    [id_libro, id_autor],
  );
};

const agregarGeneroLibro = async (id_libro, id_genero) => {
  await pool.query(
    `
        INSERT INTO libro_genero (id_libro, id_genero)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `,
    [id_libro, id_genero],
  );
};

// RUTA PUT /libros/isbn/:isbn (actualizar libro por ISBN)
const actualizarLibroPorIsbn = async (isbn, precio, stock, descuento) => {
  const { rows } = await pool.query(
    `
        UPDATE libro
        SET 
            precio = $1,
            stock = $2,
            descuento = $3,
            activo = true
        WHERE isbn = $4
        RETURNING *
    `,
    [precio, stock, descuento, isbn],
  );

  return rows[0];
};

// ACTIVAR / DESACTIVAR LIBRO
const cambiarEstadoLibro = async (id, activo) => {
  const { rows } = await pool.query(
    `
        UPDATE libro
        SET activo = $1
        WHERE id_libro = $2
        RETURNING *
    `,
    [activo, id],
  );

  return rows[0];
};

const actualizarLibro = async (id, datos) => {
  const { precio, stock, descuento, titulo, descripcion, imagen, formato } =
    datos;

  const { rows } = await pool.query(
    `
        UPDATE libro
        SET
            precio = COALESCE($1, precio),
            stock = COALESCE($2, stock),
            descuento = COALESCE($3, descuento),
            titulo = COALESCE($4, titulo),
            descripcion = COALESCE($5, descripcion),
            imagen = COALESCE($6, imagen),
            formato = COALESCE($7, formato),
            activo = true
        WHERE id_libro = $8
        RETURNING *
    `,
    [
      precio ?? null,
      stock ?? null,
      descuento ?? null,
      titulo ?? null,
      descripcion ?? null,
      imagen ?? null,
      formato ?? null,
      id,
    ],
  );

  return rows[0];
};

// RUTA GET /libros/buscar?q=...en la Navbar del frontend
const buscarLibros = async (q) => {
  const { rows } = await pool.query(
    `
    SELECT DISTINCT
      l.id_libro,
      l.titulo,
      l.isbn,
      l.precio,
      l.descuento,
      TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
      l.imagen,
      l.stock,
      e.nombre AS editorial
    FROM libro l
    LEFT JOIN editorial e ON l.id_editorial = e.id_editorial
    LEFT JOIN libro_autor la ON l.id_libro = la.id_libro
    LEFT JOIN autor a ON la.id_autor = a.id_autor
    LEFT JOIN libro_genero lg ON l.id_libro = lg.id_libro
    LEFT JOIN genero g ON lg.id_genero = g.id_genero
    WHERE l.activo = true
    AND (
      LOWER(l.titulo) LIKE LOWER('%' || $1 || '%')
      OR LOWER(a.nombre) LIKE LOWER('%' || $1 || '%')
      OR LOWER(l.isbn) LIKE LOWER('%' || $1 || '%')
      OR LOWER(g.nombre) LIKE LOWER('%' || $1 || '%')
    )
    ORDER BY l.titulo ASC
  `,
    [q],
  );

  return rows;
};

// RUTA GET /libros/Preventa
const obtenerPreventa = async () => {
  const { rows } = await pool.query(`
      SELECT
        l.id_libro,
        l.titulo,
        l.isbn,
        l.precio,
        l.descuento,
        TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
        l.imagen,
        l.stock,
        l.formato,
        STRING_AGG(DISTINCT a.nombre, ', ') AS autores  -- 👈 agregar esto
      FROM libro l
      LEFT JOIN libro_autor la ON l.id_libro = la.id_libro  -- 👈 agregar esto
      LEFT JOIN autor a ON la.id_autor = a.id_autor          -- 👈 agregar esto
      WHERE l.activo = true
      AND LOWER(l.formato) = 'preventa'
      GROUP BY l.id_libro, l.titulo, l.isbn, l.precio, l.descuento,  -- 👈 agregar GROUP BY
               l.imagen, l.stock, l.formato
      ORDER BY l.fecha_publicacion ASC
    `);

  return rows;
};

// Ruta PUT /libros/preventa/recibir/:id_libro para recibir stock de un libro en preventa
const recibirPreventa = async (id_libro, stock_llegado, descuento = 0) => {
  const { rows: libroRows } = await pool.query(`
    SELECT id_libro, titulo, formato
    FROM libro
    WHERE id_libro = $1
  `, [id_libro]);

  if (libroRows.length === 0) return null;

  const libro = libroRows[0];

  if (libro.formato?.toLowerCase() !== "preventa") {
    throw {
      code: 400,
      message: "Este libro no está en preventa",
    };
  }

  const { rows: vendidosRows } = await pool.query(`
    SELECT COALESCE(SUM(dp.cantidad), 0)::INT AS vendidos
    FROM detalle_pedido dp
    JOIN pedido p ON dp.id_pedido = p.id_pedido
    WHERE dp.id_libro = $1
  `, [id_libro]);

  const vendidosPreventa = Number(vendidosRows[0].vendidos);
  const stockLlegado = Number(stock_llegado);

  const stockFinal = Math.max(stockLlegado - vendidosPreventa, 0);

  const nuevoFormato =
    stockLlegado > vendidosPreventa ? "fisico" : "preventa";

  const { rows } = await pool.query(`
    UPDATE libro
    SET
      stock = $1,
      descuento = $2,
      formato = $3,
      activo = true
    WHERE id_libro = $4
    RETURNING *
  `, [stockFinal, descuento, nuevoFormato, id_libro]);

  return {
    libro: rows[0],
    stock_llegado: stockLlegado,
    vendidos_preventa: vendidosPreventa,
    stock_final: stockFinal,
    formato_final: nuevoFormato,
  };
};

module.exports = {
  obtenerLibros,
  obtenerLibroById,
  obtenerLibrosAdmin,
  actualizarLibro,
  crearLibro,
  actualizarLibroPorIsbn,
  cambiarEstadoLibro,
  filtrarLibros,
  obtenerLibroByIsbn,
  buscarLibros,
  obtenerPreventa,
  recibirPreventa,
  agregarAutorLibro,
  agregarGeneroLibro,
};
