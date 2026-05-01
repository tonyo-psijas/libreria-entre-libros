const { pool } = require("../database/db");

const obtenerOCrearAutor = async (nombre) => {
    const { rows } = await pool.query(
        "SELECT id_autor FROM autor WHERE nombre = $1",
        [nombre]
    );

    if (rows.length > 0) return rows[0].id_autor;

    const result = await pool.query(
        "INSERT INTO autor (nombre) VALUES ($1) RETURNING id_autor",
        [nombre]
    );

    return result.rows[0].id_autor;
};

module.exports = { obtenerOCrearAutor };