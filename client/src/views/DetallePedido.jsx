import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const DetallePedido = () => {
  const { id_pedido } = useParams();
  const { detallePedido, loadingDetalle, cargarDetallePedido } = useOrders();

  const [resumen, setResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(true);

  // Cargar items del pedido y resumen en paralelo
  useEffect(() => {
    cargarDetallePedido(id_pedido);

    const cargarResumen = async () => {
      setLoadingResumen(true);
      try {
        const res = await fetch(`${BASE_URL}/pedidos/resumen/${id_pedido}`, {
          headers: authHeaders(),
        });
        const json = await res.json();
        setResumen(json.data ?? null);
      } catch (err) {
        console.error("Error al cargar resumen del pedido:", err);
      } finally {
        setLoadingResumen(false);
      }
    };

    cargarResumen();
  }, [id_pedido]);

  const cargando = loadingDetalle || loadingResumen;

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!detallePedido || detallePedido.length === 0) {
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

      {/* ENCABEZADO */}
      <div className="text-center mb-5">
        <i
          className="fa-regular fa-circle-check fa-3x mb-3"
          style={{ color: "#4A5947" }}
        ></i>
        <h3 className="fw-semibold">¡Pedido confirmado!</h3>
        <p className="text-secondary">
          El pedido N° <strong>{id_pedido}</strong>
          {resumen?.fecha && ` fue registrado el ${resumen.fecha}`}.
        </p>
      </div>

      <div className="row g-4 align-items-start">

        {/* LIBROS COMPRADOS */}
        <div className="col-12 col-lg-8">
          <div className="profile-content">
            <h6 className="fw-semibold mb-3">LIBROS COMPRADOS</h6>
            <hr className="divider mb-1" />

            {detallePedido.map((item, index) => (
              <div key={item.id_detalle}>
                <div className="d-flex gap-3 align-items-center item-libro">
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold mb-0">{item.titulo}</h6>
                    <p className="text-secondary mb-0">
                      Cantidad: {item.cantidad}
                    </p>
                    <p className="text-secondary mb-0">
                      Precio unitario: $
                      {Number(item.precio_unitario).toLocaleString("es-CL")}
                    </p>
                  </div>
                  <p className="fw-semibold mb-0">
                    ${Number(item.subtotal).toLocaleString("es-CL")}
                  </p>
                </div>
                {index < detallePedido.length - 1 && (
                  <hr className="divider" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN */}
        <div className="col-12 col-lg-4">
          <div className="profile-content pb-4">
            <h6 className="fw-semibold mb-3">RESUMEN</h6>
            <hr className="divider mb-3" />

            {resumen ? (
              <>
                {/* Cliente */}
                <div className="mb-3">
                  <p className="mb-1" style={{ fontSize: "13px", textTransform: "uppercase", fontWeight: 600, color: "#6B705C" }}>
                    Cliente
                  </p>
                  <p className="fw-semibold mb-0">{resumen.cliente_nombre}</p>
                  <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>
                    {resumen.cliente_email}
                  </p>
                </div>

                <hr className="divider mb-3" />

                {/* Estado */}
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Estado</span>
                  <span className="badge" style={{ backgroundColor: "#4A5947" }}>
                    {resumen.estado}
                  </span>
                </div>

                {/* Método de pago */}
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Método de pago</span>
                  <span className="fw-semibold">
                    {resumen.metodo_pago || "—"}
                  </span>
                </div>

                {/* Empresa de envío */}
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <span>Empresa de envío</span>
                  <span className="fw-semibold">
                    {resumen.empresa_envio || "—"}
                  </span>
                </div>

                <hr className="divider my-3" />

                {/* Total */}
                <div className="d-flex justify-content-between fw-semibold">
                  <span>Total pagado</span>
                  <span className="card-price fs-5">
                    ${Number(resumen.total).toLocaleString("es-CL")}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-secondary">No se pudo cargar el resumen.</p>
            )}

            <hr className="divider my-3" />

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