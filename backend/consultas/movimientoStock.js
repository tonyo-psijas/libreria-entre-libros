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
        let cantidadDisponible = stockAnterior + Number(cantidad);

        const { rows: preventasPendientes } = await client.query(
          `
      SELECT
        dp.id_detalle,
        dp.cantidad,
        p.fecha,
        p.id_pedido
      FROM detalle_pedido dp
      JOIN pedido p ON dp.id_pedido = p.id_pedido
      WHERE dp.id_libro = $1
      AND dp.tipo_venta = 'preventa'
      AND dp.estado_preventa = 'pendiente'
      ORDER BY p.fecha ASC, p.id_pedido ASC
      `,
          [id_libro],
        );

        for (const preventa of preventasPendientes) {
          const cantidadPedida = Number(preventa.cantidad);

          if (cantidadPedida <= cantidadDisponible) {
            await client.query(
              `
          UPDATE detalle_pedido
          SET estado_preventa = 'cubierta'
          WHERE id_detalle = $1
          `,
              [preventa.id_detalle],
            );

            cantidadDisponible -= cantidadPedida;
          }
        }

        stockNuevo = cantidadDisponible;

        const { rows: pendientesRows } = await client.query(
          `
      SELECT COUNT(*)::INT AS pendientes
      FROM detalle_pedido
      WHERE id_libro = $1
      AND tipo_venta = 'preventa'
      AND estado_preventa = 'pendiente'
      `,
          [id_libro],
        );

        const pendientes = Number(pendientesRows[0].pendientes);

        const nuevoFormato = pendientes === 0 ? "fisico" : "preventa";
        const nuevoDescuento = nuevoFormato === "fisico" ? 0 : libro.descuento;

        await client.query(
          `
      UPDATE libro
      SET stock = $1,
          formato = $2,
          descuento = $3,
          activo = true
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

// Para ruta GET para obtener movimientos con filtros opcionales
const obtenerMovimientoStock = async ({
  desde,
  hasta,
  tipo,
  motivo,
  libro,
} = {}) => {
  const values = [];
  const conditions = [];

  if (desde) {
    values.push(desde);
    conditions.push(`ms.fecha_movimiento::date >= $${values.length}`);
  }

  if (hasta) {
    values.push(hasta);
    conditions.push(`ms.fecha_movimiento::date <= $${values.length}`);
  }

  if (tipo) {
    values.push(tipo);
    conditions.push(`ms.tipo = $${values.length}`);
  }

  if (motivo) {
    values.push(motivo);
    conditions.push(`ms.motivo = $${values.length}`);
  }

  if (libro) {
    values.push(`%${libro}%`);
    conditions.push(`l.titulo ILIKE $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `
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
    ${where}
    ORDER BY ms.fecha_movimiento DESC
  `,
    values,
  );

  return rows;
};

module.exports = {
  crearMovimientoStock,
  obtenerMovimientoStock,
};
