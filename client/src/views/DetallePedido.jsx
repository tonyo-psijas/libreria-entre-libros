import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";

export const DetallePedido = () => {
  const { id_pedido } = useParams();
  const { detallePedido, loadingDetalle, cargarDetallePedido, pedidos, cargarPedidos } = useOrders();

  useEffect(() => {
    cargarDetallePedido(id_pedido);
    cargarPedidos();
  }, [id_pedido]);

  // Buscamos el resumen del pedido (fecha, total, estado) en la lista de pedidos
  const resumen = pedidos.find((p) => p.id_pedido === parseInt(id_pedido));

  if (loadingDetalle) {
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

      {/* CONFIRMACIÓN */}
      <div className="text-center mb-5">
        <i
          className="fa-regular fa-circle-check fa-3x mb-3"
          style={{ color: "#4A5947" }}
        ></i>
        <h3 className="fw-semibold">¡Pedido confirmado!</h3>
        <p className="text-secondary">
          Gracias por tu compra. Tu pedido N°{" "}
          <strong>{id_pedido}</strong>
          {resumen?.fecha && ` fue registrado el ${resumen.fecha}`}.
        </p>
      </div>

      <div className="row g-4 align-items-start">

        {/* DETALLE DE ITEMS */}
        <div className="col-12 col-lg-8">
          <div className="profile-content">
            <h6 className="fw-semibold mb-3">LIBROS COMPRADOS</h6>
            <hr className="divider mb-3" />

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

        {/* RESUMEN Y DETALLES */}
        <div className="col-12 col-lg-4">
          <div className="profile-content pb-4">

            <div className="resumen-pago mb-5">
              <h6 className="fw-semibold mb-3">RESUMEN</h6>
              <hr className="divider mb-3" />

              {resumen && (
                <>
                  <div className="d-flex justify-content-between text-secondary mb-2">
                    <span>Estado</span>
                    <span
                      className="badge"
                      style={{ backgroundColor: "#4A5947" }}
                    >
                      {resumen.estado}
                    </span>
                  </div>

                  <hr className="divider my-3" />

                  <div className="d-flex justify-content-between fw-semibold">
                    <span>Total pagado</span>
                    <span className="card-price fs-5">
                      ${Number(resumen.total).toLocaleString("es-CL")}
                    </span>
                  </div>
                </>
              )}
            </div>

            <Link
              to="/historial-compras"
              className="btn boton-primario w-100"
            >
              Ver mis pedidos
            </Link>
            <Link
              to="/libros"
              className="btn boton-secundario w-100 mt-2"
            >
              Seguir comprando
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};