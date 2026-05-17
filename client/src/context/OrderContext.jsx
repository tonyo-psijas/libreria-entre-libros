import { createContext, useContext, useState, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const OrderProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [detallePedido, setDetallePedido] = useState(null);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // ─── POST /pedidos ───────────────────────────────────────────────────────────
  // El backend toma el carrito directo desde la BD.
  // Solo necesita: { id_direccion, id_empresa_envio, id_metodo_pago }
  // Retorna: { data: { id_pedido, id_cliente, id_direccion, fecha, total, estado } }
  const crearPedido = async ({ id_direccion, id_empresa_envio, id_metodo_pago }) => {
    const res = await fetch(`${BASE_URL}/pedidos`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ id_direccion, id_empresa_envio, id_metodo_pago }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear el pedido");
    }

    return data.data; // { id_pedido, fecha, total, estado, ... }
  };

  // ─── GET /pedidos ────────────────────────────────────────────────────────────
  // Retorna: { data: [ { id_pedido, fecha, total, estado } ] }
  const cargarPedidos = useCallback(async () => {
    if (!getToken()) return;

    setLoadingPedidos(true);
    try {
      const res = await fetch(`${BASE_URL}/pedidos`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        setPedidos([]);
        return;
      }

      const json = await res.json();
      setPedidos(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setPedidos([]);
    } finally {
      setLoadingPedidos(false);
    }
  }, []);

  // ─── GET /pedidos/detalle/:id_pedido ─────────────────────────────────────────
  // Retorna: { data: [ { id_detalle, titulo, cantidad, precio_unitario, subtotal } ] }
  const cargarDetallePedido = useCallback(async (id_pedido) => {
    if (!getToken()) return;

    setLoadingDetalle(true);
    try {
      const res = await fetch(`${BASE_URL}/pedidos/detalle/${id_pedido}`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        setDetallePedido(null);
        return;
      }

      const json = await res.json();
      setDetallePedido(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Error al cargar detalle del pedido:", err);
      setDetallePedido(null);
    } finally {
      setLoadingDetalle(false);
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        pedidos,
        detallePedido,
        loadingPedidos,
        loadingDetalle,
        crearPedido,
        cargarPedidos,
        cargarDetallePedido,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};