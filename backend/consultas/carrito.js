const { pool } = require("../database/db");

// Obtener o crear carrito del cliente
const obtenerOCrearCarrito = async (id_cliente) => {
    const { rows } = await pool.query(`
        SELECT id_carrito
        FROM carrito
        WHERE id_cliente = $1
    `, [id_cliente]);

    if (rows.length > 0) {
        return rows[0].id_carrito;
    }

    const result = await pool.query(`
        INSERT INTO carrito (id_cliente)
        VALUES ($1)
        RETURNING id_carrito
    `, [id_cliente]);

    return result.rows[0].id_carrito;
};

// Ver carrito del cliente
const getCarrito = async (id_cliente) => {
    const { rows } = await pool.query(`
        SELECT 
            cd.id_carrito_detalle,
            l.id_libro,
            l.titulo,
            l.precio,
            l.descuento,
            TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
            cd.cantidad,
            TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT * cd.cantidad AS subtotal,
            l.imagen
        FROM carrito c
        JOIN carrito_detalle cd ON c.id_carrito = cd.id_carrito
        JOIN libro l ON cd.id_libro = l.id_libro
        WHERE c.id_cliente = $1
        AND l.activo = true
        ORDER BY cd.id_carrito_detalle ASC
    `, [id_cliente]);

    return rows;
};

// Validar stock antes de agregar el libro al carrito
const validarStockLibro = async (id_libro, cantidadSolicitada) => {
  const { rows } = await pool.query(`
    SELECT id_libro, titulo, stock, formato, activo
    FROM libro
    WHERE id_libro = $1
  `, [id_libro]);

  if (rows.length === 0) {
    throw {
      code: 404,
      message: "Libro no encontrado",
    };
  }

  const libro = rows[0];

  if (!libro.activo) {
    throw {
      code: 400,
      message: "El libro no está disponible",
    };
  }

  const esPreventa = libro.formato?.toLowerCase() === "preventa";

  if (!esPreventa && cantidadSolicitada > libro.stock) {
    throw {
      code: 400,
      message: `Stock insuficiente. Disponible: ${libro.stock}`,
    };
  }

  return libro;
};

// Agregar libro al carrito
const agregarLibroCarrito = async (id_cliente, id_libro, cantidad = 1) => {
  const id_carrito = await obtenerOCrearCarrito(id_cliente);

  const { rows } = await pool.query(`
    SELECT id_carrito_detalle, cantidad
    FROM carrito_detalle
    WHERE id_carrito = $1 AND id_libro = $2
  `, [id_carrito, id_libro]);

  const cantidadActual = rows.length > 0 ? rows[0].cantidad : 0;
  const cantidadFinal = cantidadActual + cantidad;

  await validarStockLibro(id_libro, cantidadFinal);

  if (rows.length > 0) {
    const result = await pool.query(`
      UPDATE carrito_detalle
      SET cantidad = cantidad + $1
      WHERE id_carrito = $2 AND id_libro = $3
      RETURNING *
    `, [cantidad, id_carrito, id_libro]);

    return result.rows[0];
  }

  const result = await pool.query(`
    INSERT INTO carrito_detalle (id_carrito, id_libro, cantidad)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [id_carrito, id_libro, cantidad]);

  return result.rows[0];
};

// Actualizar cantidad
const actualizarCantidadCarrito = async (id_cliente, id_libro, cantidad) => {
    const id_carrito = await obtenerOCrearCarrito(id_cliente);

    if (cantidad <= 0) {
        const result = await pool.query(`
            DELETE FROM carrito_detalle
            WHERE id_carrito = $1 AND id_libro = $2
            RETURNING *
        `, [id_carrito, id_libro]);

        return result.rows[0];
    }

    await validarStockLibro(id_libro, cantidad);

    const { rows } = await pool.query(`
        UPDATE carrito_detalle
        SET cantidad = $1
        WHERE id_carrito = $2 AND id_libro = $3
        RETURNING *
    `, [cantidad, id_carrito, id_libro]);

    return rows[0];
};

// Eliminar un libro del carrito
const eliminarLibroCarrito = async (id_cliente, id_libro) => {
    const id_carrito = await obtenerOCrearCarrito(id_cliente);

    const { rows } = await pool.query(`
        DELETE FROM carrito_detalle
        WHERE id_carrito = $1 AND id_libro = $2
        RETURNING *
    `, [id_carrito, id_libro]);

    return rows[0];
};

// Vaciar carrito
const vaciarCarrito = async (id_cliente) => {
    const id_carrito = await obtenerOCrearCarrito(id_cliente);

    await pool.query(`
        DELETE FROM carrito_detalle
        WHERE id_carrito = $1
    `, [id_carrito]);

    return true;
};

module.exports = {
    obtenerOCrearCarrito,
    getCarrito,
    validarStockLibro,
    agregarLibroCarrito,
    actualizarCantidadCarrito,
    eliminarLibroCarrito,
    vaciarCarrito
};