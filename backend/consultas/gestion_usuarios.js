const pool = require("../database/db");

// Obtener clientes por nombre/email y rol
const obtenerClientes = async (busqueda, rol) => {
  const { rows } = await pool.query(
    `
    SELECT
      id_cliente,
      nombre,
      email,
      fecha_registro,
      estado,
      rol
    FROM cliente
    WHERE
      ($1::TEXT IS NULL 
        OR LOWER(nombre) LIKE LOWER('%' || $1 || '%')
        OR LOWER(email) LIKE LOWER('%' || $1 || '%')
      )
    AND
      ($2::TEXT IS NULL OR LOWER(rol) = LOWER($2))
    ORDER BY id_cliente ASC
    `,
    [busqueda || null, rol || null]
  );

  return rows;
};

// Obtener cliente por ID
const obtenerClientePorId = async (id_cliente) => {
  const { rows } = await pool.query(
    `
    SELECT
      id_cliente,
      nombre,
      email,
      fecha_registro,
      estado,
      rol
    FROM cliente
    WHERE id_cliente = $1
    `,
    [id_cliente]
  );

  return rows[0];
};

// Cambiar rol cliente/admin
const actualizarRolCliente = async (id_cliente, rol) => {
  const { rows } = await pool.query(
    `
    UPDATE cliente
    SET rol = $1
    WHERE id_cliente = $2
    RETURNING id_cliente, nombre, email, fecha_registro, estado, rol
    `,
    [rol, id_cliente]
  );

  return rows[0];
};

// Desactivar cliente, no borrar físicamente
const eliminarCliente = async (id_cliente) => {
  const { rows } = await pool.query(
    `
    UPDATE cliente
    SET estado = false
    WHERE id_cliente = $1
    RETURNING id_cliente, nombre, email, fecha_registro, estado, rol
    `,
    [id_cliente]
  );

  return rows[0];
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  actualizarRolCliente,
  eliminarCliente,
};