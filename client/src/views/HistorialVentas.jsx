import React from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { ProfileNavComponent } from "../components/ProfileNav";

export const HistorialVentas = () => {
    const { pedidos } = useOrders();

    const totalVentas = pedidos.reduce((acc, p) => acc + p.total, 0);

    return (
        <div className="container py-5">
            <div className="row g-4">

                {/* SIDEBAR */}
                <div className="col-12 col-md-3">
                    <ProfileNavComponent />
                </div>

                {/* CONTENIDO */}
                <div className="col-12 col-md-9">
                    <div className="profile-content">

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-semibold mb-0">Historial de ventas</h4>

                            {pedidos.length > 0 && (
                                <span className="text-secondary">
                                    Total: <strong className="card-price">
                                        ${Number(totalVentas).toLocaleString('es-CL')}
                                    </strong>
                                </span>
                            )}
                        </div>

                        {pedidos.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fa-regular fa-chart-line fa-3x mb-3" style={{ color: '#6B705C' }}></i>
                                <h5 className="fw-semibold">No hay ventas registradas</h5>
                                <p className="text-secondary">Las órdenes de los clientes aparecerán aquí.</p>
                            </div>
                        ) : (
                            pedidos.map((pedido) => (
                                <div key={pedido.id_pedido}>
                                    <hr className="divider" />
                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 py-3">
                                        <div>
                                            <p className="fw-semibold mb-1">Pedido N° {pedido.id_pedido}</p>
                                            <p className="text-secondary mb-1">
                                                Cliente: <strong>{pedido.cliente.nombre}</strong> — {pedido.cliente.email}
                                            </p>
                                            <p className="text-secondary mb-0">
                                                Fecha: {pedido.fecha} · {pedido.items.length} {pedido.items.length === 1 ? 'libro' : 'libros'}
                                            </p>
                                        </div>
                                        <div className="text-sm-end">
                                            <p className="fw-semibold card-price mb-1">
                                                ${Number(pedido.total).toLocaleString('es-CL')}
                                            </p>
                                            <span className="badge mb-2" style={{ backgroundColor: '#4A5947' }}>
                                                {pedido.estado}
                                            </span>
                                            <br />
                                            <Link
                                                to={`/pedido/${pedido.id_pedido}`}
                                                className="link-editar"
                                            >
                                                <i className="fa-regular fa-eye"></i> Ver detalle
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};