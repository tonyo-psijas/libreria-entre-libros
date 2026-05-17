import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const FavoritesProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // ─── GET /favoritos ──────────────────────────────────────────────────────────
  // Respuesta: { data: [ { id_libro, titulo, precio, descuento, precio_final,
  //             imagen, fecha_agregado } ] }
  const cargarFavoritos = useCallback(async () => {
    if (!getToken()) {
      setFavoritos([]);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/favoritos`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        setFavoritos([]);
        return;
      }

      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : [];

      // Normalizamos al shape que usa la UI en ProductCard y Favoritos.jsx
      setFavoritos(
        items.map((item) => ({
          id_libro: item.id_libro,
          titulo: item.titulo,
          imagen: item.imagen,
          precio: item.precio_final ?? item.precio,
          autor: item.autores || "",
          fecha_agregado: item.fecha_agregado,
        }))
      );
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      setFavoritos([]);
    }
  }, []);

  // Cargar favoritos al montar
  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  // Escuchar eventos de login y logout para sincronizar
  useEffect(() => {
    const handleLogin = () => cargarFavoritos();
    const handleLogout = () => setFavoritos([]);

    window.addEventListener("login", handleLogin);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("login", handleLogin);
      window.removeEventListener("logout", handleLogout);
    };
  }, [cargarFavoritos]);

  // ─── POST /favoritos ─────────────────────────────────────────────────────────
  const agregarFavorito = async (libro) => {
    if (!getToken()) return;

    try {
      const res = await fetch(`${BASE_URL}/favoritos`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ id_libro: libro.id_libro }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(`❌ ${data.message || "Error al agregar a favoritos"}`);
        return;
      }

      setMensaje(`✅ "${libro.titulo}" agregado a favoritos`);
      await cargarFavoritos();
    } catch (err) {
      console.error("Error al agregar favorito:", err);
      setMensaje("❌ Error de conexión");
    }
  };

  // ─── DELETE /favoritos ───────────────────────────────────────────────────────
  const quitarFavorito = async (id_libro) => {
    if (!getToken()) return;

    const libro = favoritos.find((l) => l.id_libro === id_libro);

    try {
      const res = await fetch(`${BASE_URL}/favoritos`, {
        method: "DELETE",
        headers: authHeaders(),
        body: JSON.stringify({ id_libro }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMensaje(`❌ ${data.message || "Error al quitar de favoritos"}`);
        return;
      }

      if (libro) setMensaje(`❌ "${libro.titulo}" removido de favoritos`);
      await cargarFavoritos();
    } catch (err) {
      console.error("Error al quitar favorito:", err);
      setMensaje("❌ Error de conexión");
    }
  };

  const esFavorito = (id_libro) =>
    favoritos.some((l) => l.id_libro === id_libro);

  const toggleFavorito = (libro) => {
    if (esFavorito(libro.id_libro)) {
      quitarFavorito(libro.id_libro);
    } else {
      agregarFavorito(libro);
    }
  };

  // Limpiar mensaje automáticamente
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => setMensaje(""), 2500);
    return () => clearTimeout(timer);
  }, [mensaje]);

  return (
    <FavoritesContext.Provider
      value={{
        favoritos,
        totalFavoritos: favoritos.length,
        esFavorito,
        agregarFavorito,
        quitarFavorito,
        toggleFavorito,
        cargarFavoritos,
        mensaje,
        setMensaje,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};