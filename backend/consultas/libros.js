// consultas/libros.js

const { pool } = require("../database/db");

// RUTA GET /libros
const getLibros = async () => {
    const { rows } = await pool.query(`
        SELECT 
            id_libro,
            titulo,
            precio,
            descuento,
            TRUNC(precio * (1 - descuento / 100.0), 0)::INT AS precio_final
        FROM libro
        WHERE activo = true
        ORDER BY descuento DESC, id_libro ASC
    `);

    return rows;
};

// RUTA GET /libros/:id
const getLibroById = async (id) => {
    const { rows } = await pool.query(`
        SELECT 
            id_libro,
            titulo,
            descripcion,
            precio,
            descuento,
            TRUNC(precio * (1 - descuento / 100.0), 0)::INT AS precio_final,
            formato,
            stock,
            id_editorial,
            fecha_publicacion,
            numero_paginas,
            imagen
        FROM libro
        WHERE id_libro = $1 AND activo = true
    `, [id]);

    return rows[0];
};

// 🔹 PUT /libros/:id (actualizar descuento)
const updateDescuento = async (id, descuento) => {
    const { rows } = await pool.query(`
        UPDATE libro
        SET descuento = $1
        WHERE id_libro = $2
        RETURNING *
    `, [descuento, id]);

    return rows[0];
};

// RUTA POST /libros (crear nuevo libro)
const crearLibro = async (libro) => {
    const {
        titulo,
        isbn,
        descripcion,
        precio,
        formato,
        stock,
        id_editorial,
        fecha_publicacion,
        numero_paginas,
        imagen
    } = libro;

    const { rows } = await pool.query(`
        INSERT INTO libro (
            titulo, isbn, descripcion, precio, formato,
            stock, id_editorial, fecha_publicacion,
            numero_paginas, imagen
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
    `, [
        titulo,
        isbn,
        descripcion,
        precio,
        formato,
        stock,
        id_editorial,
        fecha_publicacion,
        numero_paginas,
        imagen
    ]);

    return rows[0];
};

const agregarAutorLibro = async (id_libro, id_autor) => {
    await pool.query(
        "INSERT INTO libro_autor (id_libro, id_autor) VALUES ($1,$2)",
        [id_libro, id_autor]
    );
};

const agregarGeneroLibro = async (id_libro, id_genero) => {
    await pool.query(
        "INSERT INTO libro_genero (id_libro, id_genero) VALUES ($1,$2)",
        [id_libro, id_genero]
    );
};

module.exports = {
    getLibros,
    getLibroById,
    updateDescuento,
    crearLibro,
    agregarAutorLibro,
    agregarGeneroLibro
};
