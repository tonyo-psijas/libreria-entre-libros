const pool = require("../database/db");

// Obtener empresas de envío
const obtenerEmpresasEnvio = async () => {
  const { rows } = await pool.query(`
    SELECT
      id_empresa_envio,
      nombre,
      telefono
    FROM empresa_envio
    ORDER BY nombre ASC
  `);

  return rows;
};

// Crear empresa de envío
const crearEmpresaEnvio = async (datos) => {
  const { nombre, telefono } = datos;

  const { rows } = await pool.query(`
    INSERT INTO empresa_envio (nombre, telefono)
    VALUES ($1, $2)
    RETURNING *
  `, [nombre, telefono]);

  return rows[0];
};

module.exports = {
  obtenerEmpresasEnvio,
  crearEmpresaEnvio,
};