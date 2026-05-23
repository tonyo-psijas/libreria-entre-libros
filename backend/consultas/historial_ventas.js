const pool = require("../database/db");

const obtenerHistorialVentas = async ({ desde, hasta, libro, genero, formato } = {}) => {
  const { rows } = await pool.query(
    `
    SELECT
      p.id_pedido,
      p.fecha AS fecha_pedido,
      p.estado,
      c.nombre AS cliente,
      c.email,
      l.id_libro,
      l.titulo AS libro,
      l.formato,
      STRING_AGG(DISTINCT g.nombre, ', ') AS generos,
      dp.cantidad,
      dp.precio_unitario,
      (dp.cantidad * dp.precio_unitario) AS subtotal
    FROM pedido p
    JOIN cliente c ON p.id_cliente = c.id_cliente
    JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    JOIN libro l ON dp.id_libro = l.id_libro
    LEFT JOIN libro_genero lg ON l.id_libro = lg.id_libro
    LEFT JOIN genero g ON lg.id_genero = g.id_genero
    WHERE
      ($1::DATE IS NULL OR p.fecha::DATE >= $1::DATE)
    AND
      ($2::DATE IS NULL OR p.fecha::DATE <= $2::DATE)
    AND
      ($3::TEXT IS NULL OR LOWER(l.titulo) LIKE LOWER('%' || $3 || '%'))
    AND
      ($4::TEXT IS NULL OR LOWER(g.nombre) LIKE LOWER('%' || $4 || '%'))
    AND
      ($5::TEXT IS NULL OR LOWER(l.formato) = LOWER($5))
    GROUP BY
      p.id_pedido,
      p.fecha,
      p.estado,
      c.nombre,
      c.email,
      l.id_libro,
      l.titulo,
      l.formato,
      dp.cantidad,
      dp.precio_unitario
    ORDER BY p.fecha DESC
    `,
    [desde || null, hasta || null, libro || null, genero || null, formato || null]
  );

  return rows;
};

module.exports = {
  obtenerHistorialVentas,
};