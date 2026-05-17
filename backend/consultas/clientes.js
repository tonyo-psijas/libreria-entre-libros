const pool = require("../database/db");
const bcrypt = require("bcryptjs");

// Registrar cliente
const registrarCliente = async ({ nombre, email, password }) => {
  const existe = await pool.query(
    "SELECT * FROM cliente WHERE email = $1",
    [email]
  );

  if (existe.rows.length > 0) {
    throw {
      code: 400,
      message: " El email ya existe"
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `
    INSERT INTO cliente (nombre, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id_cliente, nombre, email, rol
    `,
    [nombre, email, passwordHash]
  );

  return rows[0];
};

// Login cliente
const loginCliente = async (email, password) => {
  const { rows } = await pool.query(
    "SELECT * FROM cliente WHERE email = $1 AND estado = true",
    [email]
  );

  if (rows.length === 0) {
    throw {
      code: 401,
      message: "Credenciales incorrectas"
    };
  }

  const cliente = rows[0];

  const passwordValida = await bcrypt.compare(
    password,
    cliente.password_hash
  );

  if (!passwordValida) {
    throw {
      code: 401,
      message: "Credenciales incorrectas"
    };
  }

  return cliente;
};

const actualizarCliente = async (id_cliente, datos) => {
  const { nombre, email, password } = datos;

  let password_hash = undefined;

  if (password) {
    password_hash = await bcrypt.hash(password, 10);
  }

  const { rows } = await pool.query(
    `
      UPDATE cliente
      SET
        nombre = COALESCE($1, nombre),
        email = COALESCE($2, email),
        password_hash = COALESCE($3, password_hash)
      WHERE id_cliente = $4
      RETURNING id_cliente, nombre, email, rol
    `, [nombre ?? null, email ?? null, password_hash ?? null, id_cliente]
  );

  if (rows.length === 0) {
    throw { code: 404, message: "Cliente no encontrado"}
  }

  return rows[0];
}

const obtenerTodosLosClientes = async () => {
  const { rows } = await pool.query(`
    SELECT id_cliente, nombre, email, rol, estado, fecha_registro
    FROM cliente
    ORDER BY fecha_registro DESC
  `);
  return rows;
};

const cambiarRolCliente = async (id_cliente, rol) => {
  const { rows } = await pool.query(`
    UPDATE cliente
    SET rol = $1
    WHERE id_cliente = $2
    RETURNING id_cliente, nombre, email, rol
  `, [rol, id_cliente]);

  if (rows.length === 0) throw { code: 404, message: "Cliente no encontrado" };
  return rows[0];
};

const eliminarCliente = async (id_cliente) => {
  const { rows } = await pool.query(`
    DELETE FROM cliente
    WHERE id_cliente = $1
    RETURNING id_cliente, nombre, email
  `, [id_cliente]);

  if (rows.length === 0) throw { code: 404, message: "Cliente no encontrado" };
  return rows[0];
};


module.exports = {
  registrarCliente,
  loginCliente,
  actualizarCliente,
  obtenerTodosLosClientes,
  cambiarRolCliente,
  eliminarCliente,
};