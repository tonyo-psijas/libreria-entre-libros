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

module.exports = {
  registrarCliente,
  loginCliente
};