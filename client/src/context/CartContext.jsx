import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Helper: obtener el token JWT guardado en localStorage
const getToken = () => localStorage.getItem("token");

// Helper: headers con Authorization para todas las llamadas al backend
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // Mostrar toast temporalmente
  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 2500);
  };

  // ─── GET /carrito ────────────────────────────────────────────────────────────
  // Carga el carrito desde el backend. Se llama al montar y tras operaciones.
  // La respuesta tiene forma: { data: [ { id_carrito_detalle, id_libro, titulo,
  //   precio, descuento, precio_final, cantidad, subtotal, imagen } ] }
  const cargarCarrito = useCallback(async () => {
    if (!getToken()) {
      setCarrito([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/carrito`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        // Si el token expiró u otro error, vaciamos localmente sin romper la app
        setCarrito([]);
        return;
      }

      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : [];

      // Normalizamos los items al shape que usa la UI:
      // { id_libro, titulo, autor, imagen, precio, cantidad }
      // El backend devuelve precio_final (ya con descuento aplicado)
      setCarrito(
        items.map((item) => ({
          id_libro: item.id_libro,
          titulo: item.titulo,
          autor: item.autores || "",
          imagen: item.imagen,
          precio: item.precio_final ?? item.precio,
          cantidad: item.cantidad,
        }))
      );
    } catch (err) {
      console.error("Error al cargar carrito:", err);
      setCarrito([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar carrito al montar el provider (si hay sesión activa)
  useEffect(() => {
    cargarCarrito();
  }, [cargarCarrito]);

  useEffect(() => {
    const handleLogout = () => limpiarCarritoLocal();
    const handleLogin = () => cargarCarrito();

    window.addEventListener("logout", handleLogout);
    window.addEventListener("login", handleLogin);

    return () => {
      window.removeEventListener("logout", handleLogout);
      window.removeEventListener("login", handleLogin);
    } 
    
  }, []);

  // ─── POST /carrito ───────────────────────────────────────────────────────────
  const agregarAlCarrito = async (libro, cantidad = 1) => {
    if (!getToken()) return;

    try {
      const res = await fetch(`${BASE_URL}/carrito`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ id_libro: libro.id_libro, cantidad }),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarMensaje(`❌ ${data.message || "Error al agregar al carrito"}`);
        return;
      }

      mostrarMensaje(`✅ "${libro.titulo}" agregado al carrito`);
      await cargarCarrito(); // Sincronizar con el backend
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      mostrarMensaje("❌ Error de conexión");
    }
  };

  // ─── PUT /carrito/:id_libro ──────────────────────────────────────────────────
  const actualizarCantidad = async (id_libro, cantidad) => {
    if (!getToken()) return;

    // Si cantidad <= 0, delegamos a quitarDelCarrito
    if (cantidad <= 0) {
      await quitarDelCarrito(id_libro);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/carrito/${id_libro}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ cantidad }),
      });

      if (!res.ok) {
        const data = await res.json();
        mostrarMensaje(`❌ ${data.message || "Error al actualizar cantidad"}`);
        return;
      }

      await cargarCarrito();
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      mostrarMensaje("❌ Error de conexión");
    }
  };

  // ─── DELETE /carrito/:id_libro ───────────────────────────────────────────────
  const quitarDelCarrito = async (id_libro) => {
    if (!getToken()) return;

    const libro = carrito.find((item) => item.id_libro === id_libro);

    try {
      const res = await fetch(`${BASE_URL}/carrito/${id_libro}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        mostrarMensaje(`❌ ${data.message || "Error al eliminar del carrito"}`);
        return;
      }

      if (libro) mostrarMensaje(`❌ "${libro.titulo}" removido del carrito`);
      await cargarCarrito();
    } catch (err) {
      console.error("Error al quitar del carrito:", err);
      mostrarMensaje("❌ Error de conexión");
    }
  };

  // ─── DELETE /carrito ─────────────────────────────────────────────────────────
  const vaciarCarrito = async () => {
    if (!getToken()) return;

    try {
      const res = await fetch(`${BASE_URL}/carrito`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        mostrarMensaje(`❌ ${data.message || "Error al vaciar el carrito"}`);
        return;
      }

      mostrarMensaje("🗑️ Carrito vaciado");
      setCarrito([]);
    } catch (err) {
      console.error("Error al vaciar carrito:", err);
      mostrarMensaje("❌ Error de conexión");
    }
  };

  // Limpia el estado local al cerrar sesión (llamar desde UserContext/logout)
  const limpiarCarritoLocal = () => setCarrito([]);

  // Totales derivados
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        loading,
        agregarAlCarrito,
        quitarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        cargarCarrito,
        limpiarCarritoLocal,
        totalItems,
        totalPrecio,
        mensaje,
        setMensaje,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};