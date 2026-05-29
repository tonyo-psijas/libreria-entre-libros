const pool = require("../database/db");

// Para ruta POST
const crearMovimientoStock = async ({
  id_libro,
  id_admin,
  tipo,
  motivo,
  referencia,
  cantidad,
  observacion,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: libroRows } = await client.query(
      `
      SELECT id_libro, titulo, stock, formato, descuento
      FROM libro
      WHERE id_libro = $1
      FOR UPDATE
    `,
      [id_libro],
    );

    if (libroRows.length === 0) {
      throw {
        code: 404,
        message: "Libro no encontrado",
      };
    }

    const libro = libroRows[0];
    const stockAnterior = Number(libro.stock);
    let stockNuevo = stockAnterior;

    if (tipo === "ingreso") {
      if (libro.formato?.toLowerCase() === "preventa") {
        const { rows: vendidosRows } = await client.query(
          `
          SELECT COALESCE(SUM(dp.cantidad), 0)::INT AS vendidos
          FROM detalle_pedido dp
          JOIN pedido p ON dp.id_pedido = p.id_pedido
          WHERE dp.id_libro = $1
        `,
          [id_libro],
        );

        const vendidosPreventa = Number(vendidosRows[0].vendidos);
        const stockFinalPreventa = Number(cantidad) - vendidosPreventa;

        stockNuevo = Math.max(stockFinalPreventa, 0);

        const nuevoFormato =
          Number(cantidad) > vendidosPreventa ? "fisico" : "preventa";

        const nuevoDescuento = nuevoFormato === "fisico" ? 0 : libro.descuento;

        await client.query(
          `
          UPDATE libro
          SET stock = $1, formato = $2, descuento = $3,activo = true
          WHERE id_libro = $4
        `,
          [stockNuevo, nuevoFormato, nuevoDescuento, id_libro],
        );
      } else {
        stockNuevo = stockAnterior + Number(cantidad);

        await client.query(
          `
          UPDATE libro
          SET stock = $1, activo = true
          WHERE id_libro = $2
        `,
          [stockNuevo, id_libro],
        );
      }
    }

    if (tipo === "egreso") {
      if (Number(cantidad) > stockAnterior) {
        throw {
          code: 400,
          message: `Stock insuficiente. Disponible: ${stockAnterior}`,
        };
      }

      stockNuevo = stockAnterior - Number(cantidad);

      await client.query(
        `
        UPDATE libro
        SET stock = $1
        WHERE id_libro = $2
      `,
        [stockNuevo, id_libro],
      );
    }

    const { rows: movimientoRows } = await client.query(
      `
      INSERT INTO movimiento_stock (
        id_libro,
        id_admin,
        tipo,
        motivo,
        referencia,
        cantidad,
        stock_anterior,
        stock_nuevo,
        observacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `,
      [
        id_libro,
        id_admin,
        tipo,
        motivo,
        referencia || null,
        cantidad,
        stockAnterior,
        stockNuevo,
        observacion || null,
      ],
    );

    await client.query("COMMIT");

    return {
      movimiento: movimientoRows[0],
      libro: {
        ...libro,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Para ruta GET
const obtenerMovimientoStock = async () => {
  const { rows } = await pool.query(`
    SELECT
      ms.id_movimiento,
      ms.fecha_movimiento,
      ms.id_libro,
      l.titulo,
      ms.tipo,
      ms.motivo,
      ms.referencia,
      ms.cantidad,
      ms.stock_anterior,
      ms.stock_nuevo,
      c.nombre AS administrador,
      ms.observacion
    FROM movimiento_stock ms
    JOIN libro l
      ON ms.id_libro = l.id_libro
    LEFT JOIN cliente c
      ON ms.id_admin = c.id_cliente
    ORDER BY ms.fecha_movimiento DESC
  `);

  return rows;
};

module.exports = {
  crearMovimientoStock,
  obtenerMovimientoStock,
};
