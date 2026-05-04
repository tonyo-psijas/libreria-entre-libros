const { pool } = require("../database/db");

const getGeneros = async () => {
  const { rows } = await pool.query(`
    SELECT id_genero, nombre
    FROM genero
    ORDER BY nombre ASC
  `);

  return rows;
};

const obtenerOCrearGenero = async (nombre) => {
  const { rows } = await pool.query(`
    INSERT INTO genero (nombre)
    VALUES ($1)
    ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
    RETURNING id_genero
  `, [nombre]);

  return rows[0].id_genero;
};

module.exports = {
  getGeneros,
  obtenerOCrearGenero,
};