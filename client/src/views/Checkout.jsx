import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useOrders } from "../context/OrderContext";

const METODOS_PAGO = [
    { id: "webpay", label: "WebPay", icono: "fa-credit-card" },
    { id: "tarjeta", label: "Tarjeta de crédito/débito", icono: "fa-credit-card-blank" },
    { id: "transferencia", label: "Transferencia bancaria", icono: "fa-building-columns" },
];

export const Checkout = () => {
    const navigate = useNavigate();
    const { carrito, totalItems, totalPrecio, vaciarCarrito } = useCart();
    const { user } = useUser();
    const { crearPedido } = useOrders();

    const [metodoPago, setMetodoPago] = useState("");
    const [direccion, setDireccion] = useState({
        destinatario: user?.nombre || "",
        calle: "",
        numero: "",
        ciudad: "",
        pais: "Chile",
        codigo_postal: "",
    });
    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(false);

    const handleDireccionChange = (e) => {
        const { name, value } = e.target;
        setDireccion(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmar = async (e) => {
        e.preventDefault();
        setError("");

        if (!metodoPago) {
            setError("Por favor selecciona un método de pago.");
            return;
        }
        if (!direccion.calle || !direccion.numero || !direccion.ciudad) {
            setError("Por favor completa todos los campos de dirección.");
            return;
        }

        setProcesando(true);

        // Simulación de procesamiento
        // TODO: reemplazar por POST /pedidos cuando el backend esté listo
        await new Promise(res => setTimeout(res, 1000));

        const pedido = crearPedido({
            items: carrito,
            total: totalPrecio,
            direccion,
            metodoPago,
            cliente: user,
        });

        vaciarCarrito();
        navigate(`/pedido/${pedido.id_pedido}`);
    };

    if (carrito.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h5>No tienes productos en el carrito.</h5>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h4 className="fw-semibold mb-4">Finalizar compra</h4>

            <form onSubmit={handleConfirmar}>
                <div className="row g-4 align-items-start">

                    {/* COLUMNA IZQUIERDA — dirección + pago */}
                    <div className="col-12 col-lg-8">

                        {/* DIRECCIÓN */}
                        <div className="profile-content mb-4 pb-4">
                            <h6 className="fw-semibold mb-3">DIRECCIÓN DE ENVÍO</h6>
                            <hr className="divider mb-3" />

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Destinatario</label>
                                    <input
                                        type="text"
                                        className="form-control form-input"
                                        name="destinatario"
                                        value={direccion.destinatario}
                                        onChange={handleDireccionChange}
                                        required
                                    />
                                </div>

                                <div className="col-8">
                                    <label className="form-label">Calle</label>
                                    <input
                                        type="text"
                                        className="form-control form-input"
                                        name="calle"
                                        value={direccion.calle}
                                        onChange={handleDireccionChange}
                                        placeholder="Av. Ejemplo"
                                        required
                                    />
                                </div>

                                <div className="col-4">
                                    <label className="form-label">Número</label>
                                    <input
                                        type="text"
                                        className="form-control form-input"
                                        name="numero"
                                        value={direccion.numero}
                                        onChange={handleDireccionChange}
                                        placeholder="1234"
                                        required
                                    />
                                </div>

                                <div className="col-12 col-sm-6">
                                    <label className="form-label">Ciudad</label>
                                    <input
                                        type="text"
                                        className="form-control form-input"
                                        name="ciudad"
                                        value={direccion.ciudad}
                                        onChange={handleDireccionChange}
                                        placeholder="Santiago"
                                        required
                                    />
                                </div>

                                <div className="col-12 col-sm-6">
                                    <label className="form-label">País</label>
                                    <input
                                        type="text"
                                        className="form-control form-input"
                                        name="pais"
                                        value={direccion.pais}
                                        onChange={handleDireccionChange}
                                    />
                                </div>

                                <div className="col-12 col-sm-6">
                                    <label className="form-label">Código postal</label>
                                    <input
                                        type="text"
                                        className="form-control form-input"
                                        name="codigo_postal"
                                        value={direccion.codigo_postal}
                                        onChange={handleDireccionChange}
                                        placeholder="7500000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MÉTODO DE PAGO */}
                        <div className="profile-content pb-4">
                            <h6 className="fw-semibold mb-3">MÉTODO DE PAGO</h6>

                            <div className="d-flex flex-column gap-2">
                                {METODOS_PAGO.map(metodo => (
                                    <label
                                        key={metodo.id}
                                        className={`metodo-pago-option ${metodoPago === metodo.id ? 'selected' : ''}`}
                                        onClick={() => setMetodoPago(metodo.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            padding: "1rem",
                                            border: metodoPago === metodo.id
                                                ? "2px solid #4A5947"
                                                : "1px solid #D4D9C7",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            backgroundColor: metodoPago === metodo.id ? "#F1F2ED" : "white",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value={metodo.id}
                                            checked={metodoPago === metodo.id}
                                            onChange={() => setMetodoPago(metodo.id)}
                                        />
                                        <i className={`fa-regular ${metodo.icono} fs-5`} style={{ color: '#4A5947' }}></i>
                                        <span className="fw-semibold">{metodo.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA — resumen */}
                    <div className="col-12 col-lg-4">
                        <div className="profile-content pb-4">
                            <h6 className="fw-semibold mb-3">RESUMEN DEL PEDIDO</h6>
                            <hr className="divider mb-3" />

                            {carrito.map(item => (
                                <div key={item.id_libro} className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary" style={{ maxWidth: '65%' }}>
                                        {item.titulo} <span className="fw-semibold">x{item.cantidad}</span>
                                    </span>
                                    <span className="fw-semibold">
                                        ${Number(item.precio * item.cantidad).toLocaleString('es-CL')}
                                    </span>
                                </div>
                            ))}

                            <hr className="divider my-3" />

                            <div className="d-flex justify-content-between text-secondary mb-2">
                                <span>Subtotal ({totalItems} {totalItems === 1 ? 'libro' : 'libros'})</span>
                                <span>${Number(totalPrecio).toLocaleString('es-CL')}</span>
                            </div>

                            <div className="d-flex justify-content-between text-secondary mb-3">
                                <span>Envío</span>
                                <span>Por calcular</span>
                            </div>

                            <hr className="divider mb-3" />

                            <div className="d-flex justify-content-between fw-semibold mb-4">
                                <span>Total</span>
                                <span className="card-price fs-5">
                                    ${Number(totalPrecio).toLocaleString('es-CL')}
                                </span>
                            </div>

                            {error && (
                                <div className="alert alert-danger py-2 mb-3" role="alert">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn boton-primario w-100 py-2 fw-semibold"
                                disabled={procesando}
                            >
                                {procesando
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</>
                                    : <>Confirmar pedido <i className="fa-regular fa-chevron-right"></i></>
                                }
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};