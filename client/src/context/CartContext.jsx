import { createContext, useContext, useState } from "react";

// 1. Crear el contexto
export const CartContext = createContext();

// 2. Hook personalizado para consumir el contexto fácilmente
//    En vez de escribir useContext(CartContext) en cada componente,
//    simplemente escribes useCart()
export const useCart = () => useContext(CartContext);

// 3. Provider — envuelve la app y comparte el estado del carrito
export const CartProvider = ({ children }) => {
  // Cada item del carrito tendrá: { id_libro, titulo, autor, imagen, precio, cantidad }
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Función para mostrar mensaje temporal
  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 2000);
  };

  // Agregar un libro al carrito
  // Si ya existe, aumenta la cantidad en 1
  const agregarAlCarrito = (libro) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_libro === libro.id_libro);
      if (existe) {
        mostrarMensaje(`✅ ${libro.titulo} (cantidad +1)`);
        return prev.map((item) =>
          item.id_libro === libro.id_libro
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      mostrarMensaje(`✅ "${libro.titulo}" agregado al carrito`);
      return [...prev, { ...libro, cantidad: 1 }];
    });
  };

  // Quitar un libro completamente del carrito
  const quitarDelCarrito = (id_libro) => {
    const libro = carrito.find((item) => item.id_libro === id_libro);
    if (libro) {
      mostrarMensaje(`❌ "${libro.titulo}" removido del carrito`);
    }
    setCarrito((prev) => prev.filter((item) => item.id_libro !== id_libro));
  };

  // Cambiar la cantidad de un libro directamente
  // Si la cantidad llega a 0, se elimina
  const actualizarCantidad = (id_libro, cantidad) => {
    if (cantidad <= 0) {
      quitarDelCarrito(id_libro);
      return;
    }
    setCarrito((prev) =>
      prev.map((item) =>
        item.id_libro === id_libro ? { ...item, cantidad } : item,
      ),
    );
  };

  // Vaciar el carrito completo
  const vaciarCarrito = () => {
    mostrarMensaje(`🗑️ Carrito vaciado`);
    setCarrito([]);
  };

  // Total de items (suma de cantidades)
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Total a pagar
  const totalPrecio = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        quitarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
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
