import React from "react";
import { Link } from "react-router-dom";

export const AtencionCliente = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="profile-content p-4 p-md-5">
            <h2 className="fw-semibold mb-4" style={{ color: "#2C4A2E" }}>
              Atención al Cliente
            </h2>

            <h5 className="fw-semibold mt-4">📧 Correo electrónico</h5>
            <p>contacto@entrelibros.cl</p>

            <h5 className="fw-semibold mt-4">📞 Teléfono</h5>
            <p>+56 2 2200 3345</p>

            <h5 className="fw-semibold mt-4">⏰ Horario de atención</h5>
            <p>Lunes a Viernes: 9:00 - 19:00</p>
            <p>Sábados: 10:00 - 14:00</p>

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
