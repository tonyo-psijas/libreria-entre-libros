const pool = require("../database/db");

const crearPedidoDesdeCarrito = async (
  id_cliente,
  id_direccion,
  id_empresa_envio,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const carritoQuery = await client.query(
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

    const pedidoResult = await client.query(
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

      await client.query(
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
        await client.query(
          `
          UPDATE libro
          SET stock = stock - $1
          WHERE id_libro = $2
        `,
          [item.cantidad, item.id_libro],
        );
      }
    }

    await client.query(
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

    await client.query(
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

    await client.query("COMMIT");

    return pedido;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getPedidosCliente = async (id_cliente) => {
  const { rows } = await pool.query(
    `
    SELECT
      id_pedido,
      fecha_pedido,
      total,
      estado
    FROM pedido
    WHERE id_cliente = $1
    ORDER BY fecha_pedido DESC
  `,
    [id_cliente],
  );

  return rows;
};

const getDetallePedido = async (id_pedido) => {
  const { rows } = await pool.query(
    `
    SELECT
      dp.id_detalle_pedido,
      l.titulo,
      dp.cantidad,
      dp.precio_unitario,
      dp.cantidad * dp.precio_unitario AS subtotal
    FROM detalle_pedido dp
    JOIN libro l ON dp.id_libro = l.id_libro
    WHERE dp.id_pedido = $1
  `,
    [id_pedido],
  );

  return rows;
};

module.exports = {
  crearPedidoDesdeCarrito,
  getPedidosCliente,
  getDetallePedido,
};
