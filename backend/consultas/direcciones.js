const pool = require("../database/db");

// Obtener direcciones de un cliente
const getDireccionesCliente = async (id_cliente) => {
  const { rows } = await pool.query(`
    SELECT
      id_direccion,
      id_cliente,
      alias,
      destinatario,
      telefono,
      pais,
      ciudad,
      calle,
      numero,
      codigo_postal
    FROM direccion
    WHERE id_cliente = $1
    ORDER BY id_direccion ASC
  `, [id_cliente]);

  return rows;
};

// Crear dirección
const crearDireccion = async (id_cliente, datos) => {
  const {
    alias,
    destinatario,
    telefono,
    pais,
    ciudad,
    calle,
    numero,
    codigo_postal,
  } = datos;

  const { rows } = await pool.query(`
    INSERT INTO direccion (
      id_cliente,
      alias,
      destinatario,
      telefono,
      pais,
      ciudad,
      calle,
      numero,
      codigo_postal
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `, [
    id_cliente,
    alias,
    destinatario,
    telefono,
    pais,
    ciudad,
    calle,
    numero,
    codigo_postal,
  ]);

  return rows[0];
};

// Actualizar dirección
const actualizarDireccion = async (id_direccion, datos) => {
  const {
    alias,
    destinatario,
    telefono,
    pais,
    ciudad,
    calle,
    numero,
    codigo_postal,
  } = datos;

  const { rows } = await pool.query(`
    UPDATE direccion
    SET
      alias = COALESCE($1, alias),
      destinatario = COALESCE($2, destinatario),
      telefono = COALESCE($3, telefono),
      pais = COALESCE($4, pais),
      ciudad = COALESCE($5, ciudad),
      calle = COALESCE($6, calle),
      numero = COALESCE($7, numero),
      codigo_postal = COALESCE($8, codigo_postal)
    WHERE id_direccion = $9
    RETURNING *
  `, [
    alias ?? null,
    destinatario ?? null,
    telefono ?? null,
    pais ?? null,
    ciudad ?? null,
    calle ?? null,
    numero ?? null,
    codigo_postal ?? null,
    id_direccion,
  ]);

  return rows[0];
};

// Eliminar dirección
const eliminarDireccion = async (id_direccion) => {
  const { rows } = await pool.query(`
    DELETE FROM direccion
    WHERE id_direccion = $1
    RETURNING *
  `, [id_direccion]);

  return rows[0];
};

module.exports = {
  getDireccionesCliente,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
};