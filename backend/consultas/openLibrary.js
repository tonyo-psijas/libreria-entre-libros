const axios = require("axios");
const normalizarFecha = require("../utilitis/normalizar_fecha.js");

const obtenerNombreAutorOpenLibrary = async (authorKey) => {
  try {
    const url = `https://openlibrary.org${authorKey}.json`;
    const { data } = await axios.get(url);

    return data.name || null;
  } catch (error) {
    console.error("Error obteniendo autor Open Library:", error.message);
    return null;
  }
};

const buscarLibroOpenLibrary = async (isbn) => {
  const url = `https://openlibrary.org/isbn/${isbn}.json`;

  try {
    const { data } = await axios.get(url);

    const autores = [];

    if (Array.isArray(data.authors)) {
      for (const autor of data.authors) {
        if (autor.key) {
          const nombreAutor = await obtenerNombreAutorOpenLibrary(autor.key);

          if (nombreAutor) {
            autores.push(nombreAutor);
          }
        }
      }
    }

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
      autores,
      generos: data.subjects?.slice(0, 3) || [],

      idioma: data.languages?.[0]?.key?.replace("/languages/", "") || "unknown",

      imagen: data.covers?.[0]
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,

      formato: "fisico",
    };
  } catch (error) {
    return null;
  }
};

module.exports = { buscarLibroOpenLibrary };