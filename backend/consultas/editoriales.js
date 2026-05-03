const { pool } = require("../database/db");

const obtenerOCrearEditorial = async (nombre) => {
    if (!nombre) return null;

    const { rows } = await pool.query(`
        SELECT id_editorial 
        FROM editorial 
        WHERE LOWER(nombre) = LOWER($1)
    `, [nombre]);

    if (rows.length > 0) {
        return rows[0].id_editorial;
    }

    const result = await pool.query(`
        INSERT INTO editorial (nombre)
        VALUES ($1)
        RETURNING id_editorial
    `, [nombre]);

    return result.rows[0].id_editorial;
};

module.exports = { obtenerOCrearEditorial };