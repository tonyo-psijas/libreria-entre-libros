const { pool } = require("../database/db");

const obtenerOCrearGenero = async (nombre) => {
    const { rows } = await pool.query(`
        SELECT id_genero 
        FROM genero 
        WHERE LOWER(nombre) = LOWER($1)
    `, [nombre]);

    if (rows.length > 0) {
        return rows[0].id_genero;
    }

    const result = await pool.query(`
        INSERT INTO genero (nombre)
        VALUES ($1)
        RETURNING id_genero
    `, [nombre]);

    return result.rows[0].id_genero;
};

module.exports = { obtenerOCrearGenero };