import React from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

const ETIQUETAS_PAGO = {
    webpay: "WebPay",
    tarjeta: "Tarjeta de crédito/débito",
    transferencia: "Transferencia bancaria",
    paypal: "PayPal",
};

export const DetallePedido = () => {
    const { id_pedido } = useParams();
    const { pedidos } = useOrders();

    const pedido = pedidos.find(p => p.id_pedido === parseInt(id_pedido));

    if (!pedido) {
        return (
            <div className="container py-5 text-center">
                <h5 className="fw-semibold">Pedido no encontrado.</h5>
                <Link to="/historial-compras" className="btn boton-primario mt-3">
                    Ver mis pedidos
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-5">

            {/* CONFIRMACIÓN */}

            <div className="text-center mb-5">
                <i className="fa-regular fa-circle-check fa-3x mb-3" style={{ color: '#4A5947' }}></i>
                <h3 className="fw-semibold">¡Pedido confirmado!</h3>
                <p className="text-secondary">
                    Gracias por tu compra. Tu pedido N° <strong>{pedido.id_pedido}</strong> fue registrado el {pedido.fecha}.
                </p>
            </div>

            <div className="row g-4 align-items-start">

                {/* DETALLE DE ITEMS */}
                <div className="col-12 col-lg-8">
                    <div className="profile-content">
                        <h6 className="fw-semibold mb-3">LIBROS COMPRADOS</h6>
                        <hr className="divider mb-3" />

                        {pedido.items.map((item, index) => (
                            <div key={item.id_libro}>
                                <div className="d-flex gap-3 align-items-center item-libro">
                                    <img src={item.imagen} alt={item.titulo} />
                                    <div className="flex-grow-1">
                                        <p className="autor-name-card mb-0">{item.autor}</p>
                                        <h6 className="fw-semibold mb-0">{item.titulo}</h6>
                                        <p className="text-secondary mb-0">Cantidad: {item.cantidad}</p>
                                    </div>
                                    <p className="fw-semibold mb-0">
                                        ${Number(item.subtotal).toLocaleString('es-CL')}
                                    </p>
                                </div>
                                {index < pedido.items.length - 1 && <hr className="divider" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RESUMEN Y DETALLES */}
                <div className="col-12 col-lg-4">

                    <div className="profile-content pb-4">
                        {/* Resumen de pago */}
                        <div className="resumen-pago mb-5">
                            <h6 className="fw-semibold mb-3">RESUMEN</h6>
                            <hr className="divider mb-3" />

                            <div className="d-flex justify-content-between text-secondary mb-2">
                                <span>Estado</span>
                                <span className="badge" style={{ backgroundColor: '#4A5947' }}>
                                    {pedido.estado}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between text-secondary mb-2">
                                <span>Método de pago</span>
                                <span>{ETIQUETAS_PAGO[pedido.metodoPago] || pedido.metodoPago}</span>
                            </div>

                            <hr className="divider my-3" />

                            <div className="d-flex justify-content-between fw-semibold">
                                <span>Total pagado</span>
                                <span className="card-price fs-5">
                                    ${Number(pedido.total).toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div className="resumen-direccion mb-4">
                            <h6 className="fw-semibold mb-3">DIRECCIÓN DE ENVÍO</h6>
                            <hr className="divider mb-3" />
                            <p className="mb-1 fw-semibold">{pedido.direccion.destinatario}</p>
                            <p className="text-secondary mb-0">
                                {pedido.direccion.calle} {pedido.direccion.numero},<br />
                                {pedido.direccion.ciudad}, {pedido.direccion.pais}
                                {pedido.direccion.codigo_postal && `, ${pedido.direccion.codigo_postal}`}
                            </p>
                        </div>

                        <Link to="/historial-compras" className="btn boton-primario w-100">
                            Ver mis pedidos
                        </Link>
                        <Link to="/libros" className="btn boton-secundario w-100 mt-2">
                            Seguir comprando
                        </Link>

                    </div>

                    
                </div>

            </div>
        </div>
    );
};