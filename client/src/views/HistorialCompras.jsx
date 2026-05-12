import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { ProfileNavComponent } from "../components/ProfileNav";

export const HistorialCompras = () => {
  const { pedidos, loadingPedidos, cargarPedidos } = useOrders();

  useEffect(() => {
    cargarPedidos();
  }, []);

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
            <h4 className="fw-semibold mb-3">Historial de compras</h4>

            {loadingPedidos ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-regular fa-bag-shopping fa-3x mb-3"
                  style={{ color: "#6B705C" }}
                ></i>
                <h5 className="fw-semibold">Aún no tienes pedidos</h5>
                <p className="text-secondary">
                  Cuando realices una compra, aparecerá aquí.
                </p>
                <Link to="/libros" className="btn boton-primario mt-2">
                  Ver libros
                </Link>
              </div>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id_pedido}>
                  <hr className="divider" />
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 py-3">
                    <div>
                      <p className="fw-semibold mb-1">
                        Pedido N° {pedido.id_pedido}
                      </p>
                      <p className="text-secondary mb-0">
                        Fecha: {pedido.fecha}
                      </p>
                    </div>
                    <div className="text-sm-end">
                      <p className="fw-semibold card-price mb-1">
                        ${Number(pedido.total).toLocaleString("es-CL")}
                      </p>
                      <span
                        className="badge mb-2"
                        style={{ backgroundColor: "#4A5947" }}
                      >
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