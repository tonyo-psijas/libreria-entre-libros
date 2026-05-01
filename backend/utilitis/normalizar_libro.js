const normalizarLibro = (libro) => {
  return {
    titulo: libro.title || "Sin título",
    autores: libro.authors || [],
    isbn: libro.industryIdentifiers?.[0]?.identifier || null,
    descripcion: libro.description || "",
    fecha_publicacion: libro.publishedDate || null,
    paginas: libro.pageCount || null,
    generos: libro.categories || [],
    imagen: libro.imageLinks?.thumbnail || null,
    idioma: libro.language || "unknown",
    editorial: libro.publisher || null
  };
};

module.exports = normalizarLibro;