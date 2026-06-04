import React from "react";
import { Link } from "react-router-dom";

export const Privacidad = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="profile-content p-4 p-md-5">
            <h2 className="fw-semibold mb-4" style={{ color: "#2C4A2E" }}>
              Política de Privacidad
            </h2>
            <p className="text-secondary mb-4">
              Última actualización: {new Date().toLocaleDateString("es-CL")}
            </p>

            <h5 className="fw-semibold mt-4">1. Datos recopilados</h5>
            <p>
              Recopilamos la información necesaria para procesar tus pedidos y
              mejorar tu experiencia.
            </p>

            <h5 className="fw-semibold mt-4">2. Uso de la información</h5>
            <p>
              Tus datos se utilizan exclusivamente para fines de la librería y
              no se comparten con terceros sin tu consentimiento.
            </p>

            <h5 className="fw-semibold mt-4">3. Seguridad</h5>
            <p>
              Implementamos medidas de seguridad para proteger tu información
              personal.
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
