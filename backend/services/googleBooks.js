const { axios } = require("axios");

const buscarPorISBN = async (isbn) => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&langRestrict=es`;

    const { data } = await axios.get(url);

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const libro = data.items[0].volumeInfo;

    return libro;

  } catch (error) {
    console.error("Error Google Books:", error.message);
    throw { code: 500, message: "Error consultando Google Books" };
  }
};

module.exports = { buscarPorISBN };