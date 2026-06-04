import React from "react";
import { Link } from "react-router-dom";

export const Terminos = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="profile-content p-4 p-md-5">
            <h2 className="fw-semibold mb-4" style={{ color: "#2C4A2E" }}>
              Términos y Condiciones
            </h2>

            <p className="text-secondary mb-4">
              Última actualización: {new Date().toLocaleDateString("es-CL")}
            </p>

            <h5 className="fw-semibold mt-4">1. Aceptación de los términos</h5>
            <p>
              Al acceder y utilizar este sitio web, aceptas cumplir con estos
              términos y condiciones.
            </p>

            <h5 className="fw-semibold mt-4">2. Uso del sitio</h5>
            <p>
              Los usuarios se comprometen a utilizar el sitio de manera
              responsable y conforme a la ley.
            </p>

            <h5 className="fw-semibold mt-4">3. Compras y pagos</h5>
            <p>
              Todas las compras están sujetas a disponibilidad de stock y
              confirmación de pago.
            </p>

            <h5 className="fw-semibold mt-4">4. Envíos</h5>
            <p>
              Los plazos de envío son informativos y pueden variar según la
              ubicación.
            </p>

            <h5 className="fw-semibold mt-4">5. Propiedad intelectual</h5>
            <p>Todos los contenidos del sitio son propiedad de Entre Libros.</p>

            <h5 className="fw-semibold mt-4">6. Modificaciones</h5>
            <p>
              Nos reservamos el derecho de actualizar estos términos en
              cualquier momento.
            </p>

            <hr className="divider my-4" />

            <div className="text-center">
              <Link to="/registro" className="btn boton-primario">
                Volver al registro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
