import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const guardados = localStorage.getItem("favoritos");
    if (guardados) {
      setFavoritos(JSON.parse(guardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const esFavorito = (id) => favoritos.some((libro) => libro.id_libro === id);

  const agregarFavorito = (libro) => {
    if (!esFavorito(libro.id_libro)) {
      setFavoritos([...favoritos, libro]);
      setMensaje(`✅ "${libro.titulo}" agregado a favoritos`);
    }
  };

  const quitarFavorito = (id) => {
    const libro = favoritos.find((l) => l.id_libro === id);
    if (libro) {
      setFavoritos(favoritos.filter((libro) => libro.id_libro !== id));
      setMensaje(`❌ "${libro.titulo}" removido de favoritos`);
    }
  };

  const toggleFavorito = (libro) => {
    if (esFavorito(libro.id_libro)) {
      quitarFavorito(libro.id_libro);
    } else {
      agregarFavorito(libro);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        totalFavoritos: favoritos.length,
        esFavorito,
        agregarFavorito,
        quitarFavorito,
        toggleFavorito,
        mensaje,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
