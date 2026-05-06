const pool = require("../database/db");

// Obtener lista de favoritos
const obtenerFavoritos = async (id_cliente) => {
    const { rows } = await pool.query(`
        SELECT
            l.id_libro,
            l.titulo,
            l.precio,
            l.descuento,
            TRUNC(l.precio * (1 - l.descuento / 100.0), 0)::INT AS precio_final,
            l.imagen,
            f.fecha_agregado
        FROM favorito f
        JOIN libro l ON f.id_libro = l.id_libro
        WHERE f.id_cliente = $1
        AND l.activo = true
        ORDER BY f.fecha_agregado DESC
    `, [id_cliente]);

    return rows;
};

// Agregar libro a favorito
const agregarFavorito = async (id_cliente, id_libro) => {
    const { rows } = await pool.query(`
        INSERT INTO favorito (id_cliente, id_libro)
        VALUES ($1, $2)
        ON CONFLICT (id_cliente, id_libro) DO NOTHING
        RETURNING *
    `, [id_cliente, id_libro]);

    return rows[0];
};

// Eliminar libro de favoritos
const eliminarFavorito = async (id_cliente, id_libro) => {
    const { rows } = await pool.query(`
        DELETE FROM favorito
        WHERE id_cliente = $1
        AND id_libro = $2
        RETURNING *
    `, [id_cliente, id_libro]);

    return rows[0];
};

module.exports = {
    obtenerFavoritos,
    agregarFavorito,
    eliminarFavorito
};