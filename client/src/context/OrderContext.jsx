import { createContext, useContext, useState } from "react";

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    // Lista de todos los pedidos (historial global — para admin)
    const [pedidos, setPedidos] = useState([]);

    // Crear un nuevo pedido
    // Recibe: { items, total, direccion, metodoPago, cliente }
    // TODO: reemplazar por POST /pedidos cuando el backend esté listo
    const crearPedido = ({ items, total, direccion, metodoPago, cliente }) => {
        const nuevoPedido = {
            id_pedido: Date.now(),
            fecha: new Date().toLocaleDateString("es-CL"),
            estado: "En preparación",
            total,
            direccion,
            metodoPago,
            cliente: {
                id_cliente: cliente.id_cliente,
                nombre: cliente.nombre,
                email: cliente.email,
            },
            items: items.map(item => ({
                id_libro: item.id_libro,
                titulo: item.titulo,
                autor: item.autor,
                imagen: item.imagen,
                cantidad: item.cantidad,
                precio_unitario: item.precio,
                subtotal: item.precio * item.cantidad,
            })),
        };

        setPedidos(prev => [nuevoPedido, ...prev]);
        return nuevoPedido;
    };

    // Pedidos de un cliente específico
    const pedidosDelCliente = (id_cliente) =>
        pedidos.filter(p => p.cliente.id_cliente === id_cliente);

    return (
        <OrderContext.Provider value={{
            pedidos,        // todos los pedidos (admin)
            crearPedido,
            pedidosDelCliente,
        }}>
            {children}
        </OrderContext.Provider>
    );
};