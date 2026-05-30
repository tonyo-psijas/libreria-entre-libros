const pool = require("../database/db");

const crearPedidoDesdeCarrito = async (
  id_cliente,
  id_direccion,
  id_empresa_envio,
  id_metodo_pago,
) => {
  const carritoQuery = await pool.query(
    `
    SELECT
      cd.id_libro,
      cd.cantidad,
      l.precio,
      l.descuento,
      l.stock,
      l.formato,
      TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final
    FROM carrito c
    JOIN carrito_detalle cd ON c.id_carrito = cd.id_carrito
    JOIN libro l ON cd.id_libro = l.id_libro
    WHERE c.id_cliente = $1
    AND l.activo = true
    `,
    [id_cliente],
  );

  const carrito = carritoQuery.rows;

  if (carrito.length === 0) {
    throw {
      code: 400,
      message: "El carrito está vacío",
    };
  }

  for (const item of carrito) {
    const esPreventa = item.formato?.toLowerCase() === "preventa";

    if (!esPreventa && item.cantidad > item.stock) {
      throw {
        code: 400,
        message: `Stock insuficiente para libro ${item.id_libro}`,
      };
    }
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio_final * item.cantidad,
    0,
  );

  const pedidoResult = await pool.query(
    `
    INSERT INTO pedido (
      id_cliente,
      id_direccion,
      total,
      estado
    )
    VALUES ($1, $2, $3, 'pendiente')
    RETURNING *
    `,
    [id_cliente, id_direccion, total],
  );

  const pedido = pedidoResult.rows[0];

  for (const item of carrito) {
    const subtotal = item.precio_final * item.cantidad;

    await pool.query(
      `
      INSERT INTO detalle_pedido (
        id_pedido,
        id_libro,
        cantidad,
        precio_unitario,
        subtotal
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        pedido.id_pedido,
        item.id_libro,
        item.cantidad,
        item.precio_final,
        subtotal,
      ],
    );

    const esPreventa = item.formato?.toLowerCase() === "preventa";

    if (!esPreventa) {
      await pool.query(
        `
        UPDATE libro
        SET stock = stock - $1
        WHERE id_libro = $2
        `,
        [item.cantidad, item.id_libro],
      );
    }
  }

  await pool.query(
    `
    INSERT INTO envio (
      id_pedido,
      id_empresa_envio,
      estado
    )
    VALUES ($1, $2, 'pendiente')
    `,
    [pedido.id_pedido, id_empresa_envio],
  );

  await pool.query(
    `
    INSERT INTO pago (
      id_pedido,
      id_metodo_pago,
      monto,
      estado
    )
    VALUES ($1, $2, $3, 'pendiente')
    `,
    [pedido.id_pedido, id_metodo_pago, total],
  );

  await pool.query(
    `
    DELETE FROM carrito_detalle
    WHERE id_carrito = (
      SELECT id_carrito
      FROM carrito
      WHERE id_cliente = $1
    )
    `,
    [id_cliente],
  );

  return pedido;
};

const obtenerPedidosCliente = async (id_cliente) => {
  const { rows } = await pool.query(
    `
    SELECT
      id_pedido,
      fecha,
      total,
      estado
    FROM pedido
    WHERE id_cliente = $1
    ORDER BY fecha DESC
    `,
    [id_cliente],
  );

  return rows;
};

const obtenerDetallePedido = async (id_pedido) => {
  const { rows } = await pool.query(
    `
    SELECT
      dp.id_detalle,
      l.titulo,
      dp.cantidad,
      dp.precio_unitario,
      dp.subtotal
    FROM detalle_pedido dp
    JOIN libro l ON dp.id_libro = l.id_libro
    WHERE dp.id_pedido = $1
    `,
    [id_pedido],
  );

  return rows;
};

const obtenerTodosLosPedidos = async () => {
  const { rows } = await pool.query(`
    SELECT
      p.id_pedido,
      p.fecha,
      p.total,
      p.estado,
      c.id_cliente,
      c.nombre AS cliente_nombre,
      c.email AS cliente_email
    FROM pedido p
    JOIN cliente c ON p.id_cliente = c.id_cliente
    ORDER BY p.fecha DESC, p.id_pedido DESC
  `);

  return rows;
};

const obtenerResumenPedido = async (id_pedido) => {
  const { rows } = await pool.query(
    `
    SELECT
      p.id_pedido,
      p.fecha,
      p.total,
      p.estado,
      c.nombre AS cliente_nombre,
      c.email AS cliente_email,
      ee.nombre AS empresa_envio,
      mp.nombre AS metodo_pago
    FROM pedido p
    JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN envio e ON e.id_pedido = p.id_pedido
    LEFT JOIN empresa_envio ee ON ee.id_empresa_envio = e.id_empresa_envio
    LEFT JOIN pago pa ON pa.id_pedido = p.id_pedido
    LEFT JOIN metodo_pago mp ON mp.id_metodo_pago = pa.id_metodo_pago
    WHERE p.id_pedido = $1
  `,
    [id_pedido],
  );

  return rows[0];
};

module.exports = {
  crearPedidoDesdeCarrito,
  obtenerPedidosCliente,
  obtenerDetallePedido,
  obtenerTodosLosPedidos,
  obtenerResumenPedido,
};
