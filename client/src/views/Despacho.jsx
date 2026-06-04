import React from "react";
import { Link } from "react-router-dom";

export const Despacho = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="profile-content p-4 p-md-5">
            <h2 className="fw-semibold mb-4" style={{ color: "#2C4A2E" }}>
              Política de Despacho
            </h2>
            <p className="text-secondary mb-4">
              Última actualización: {new Date().toLocaleDateString("es-CL")}
            </p>

            <h5 className="fw-semibold mt-4">1. Plazos de entrega</h5>
            <p>
              Los pedidos se despachan dentro de 3-5 días hábiles según
              disponibilidad.
            </p>

            <h5 className="fw-semibold mt-4">2. Costos de envío</h5>
            <p>
              El costo de envío se calcula según la ubicación y peso del pedido.
            </p>

            <h5 className="fw-semibold mt-4">3. Seguimiento</h5>
            <p>
              Recibirás un número de seguimiento por email una vez despachado.
            </p>

            <hr className="divider my-4" />
            <div className="text-center">
              <Link to="/" className="btn boton-primario">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
