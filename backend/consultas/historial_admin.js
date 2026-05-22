const pool = require("../database/db");

const registrarActividadAdmin = async ({
  id_admin,
  nombre_admin,
  accion,
  detalle,
  ruta,
  ip
}) => {

  const { rows } = await pool.query(`
    INSERT INTO historial_admin (
      id_admin,
      nombre_admin,
      accion,
      detalle,
      ruta,
      ip
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [
    id_admin,
    nombre_admin,
    accion,
    detalle,
    ruta,
    ip
  ]);

  return rows[0];
};

const obtenerHistorialAdmin = async ({ admin, accion, desde, hasta } = {}) => {
  const { rows } = await pool.query(
    `
    SELECT
      id_historial,
      nombre_admin,
      accion,
      detalle,
      ruta,
      ip,
      fecha
    FROM historial_admin
    WHERE
      ($1::TEXT IS NULL OR LOWER(nombre_admin) LIKE LOWER('%' || $1 || '%'))
    AND
      ($2::TEXT IS NULL OR LOWER(accion) = LOWER($2))
    AND
      ($3::DATE IS NULL OR fecha::DATE >= $3::DATE)
    AND
      ($4::DATE IS NULL OR fecha::DATE <= $4::DATE)
    ORDER BY fecha DESC
    `,
    [admin || null, accion || null, desde || null, hasta || null]
  );

  return rows;
};

module.exports = {
  registrarActividadAdmin,
  obtenerHistorialAdmin
};