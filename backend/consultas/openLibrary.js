const axios = require("axios");
const normalizarFecha = require("../utilitis/normalizar_fecha.js");

const buscarLibroOpenLibrary = async (isbn) => {
    const url = `https://openlibrary.org/isbn/${isbn}.json`;

    try {
        const { data } = await axios.get(url);

        return {
            isbn,
            titulo: data.title || "Sin título",

            descripcion:
                typeof data.description === "object"
                    ? data.description.value
                    : data.description || "",

            numero_paginas: data.number_of_pages || null,
            fecha_publicacion: normalizarFecha(data.publish_date),
            editorial: data.publishers?.[0] || null,
            autores: [],
            generos: data.subjects?.slice(0, 3) || [],

            idioma: data.languages?.[0]?.key?.replace("/languages/", "") || "unknown",

            imagen: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
            formato: "Físico"
        };

    } catch (error) {
        return null;
    }
};

module.exports = { buscarLibroOpenLibrary };