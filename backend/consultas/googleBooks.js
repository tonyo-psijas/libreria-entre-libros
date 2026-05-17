const axios = require("axios");
const normalizarLibro = require("../utilitis/normalizar_libro.js");

const buscarLibroGoogleBooks = async (isbn) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    const { data } = await axios.get(url);

    if (!data.items || data.items.length === 0) {
        return null;
    }

    const info = data.items[0].volumeInfo;

    return normalizarLibro(info);
};

module.exports = { buscarLibroGoogleBooks };