import React, { useState } from "react";
import { useUser } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const Contacto = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      // TODO: Conectar con endpoint de contacto cuando esté listo
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Mensaje enviado:", formData);
      setEnviado(true);
      setFormData({
        nombre: user?.nombre || "",
        email: user?.email || "",
        telefono: "",
        asunto: "",
        mensaje: "",
      });
      setTimeout(() => setEnviado(false), 5000);
    } catch (err) {
      setError("Error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container pt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-11">

          <div className="profile-content p-4">


            {/* COLUMNAS: info izquierda + formulario derecha */}
            <div className="row gy-5 gx-5">

              {/* INFO DE CONTACTO — izquierda, alineada arriba */}
              <div className="contacto-info col-12 col-md-5 d-flex flex-column gap-3 align-items-start">

                {/* ENCABEZADO */}
                <div className="pe-0 pe-md-4">
                  <h2 className="fw-semibold">Contáctanos</h2>
                  <p className="text-secondary mt-2">
                    ¿Tienes preguntas o comentarios? Escríbenos y te responderemos pronto.
                  </p>
                </div>

                {enviado && (
                  <div className="alert alert-success" role="alert">
                    <i className="fa-regular fa-circle-check me-2"></i>
                    ¡Mensaje enviado con éxito! Te responderemos a la brevedad.
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fa-regular fa-circle-exclamation me-2"></i>
                    {error}
                  </div>
                )}

                <div
                  className="d-flex align-items-center gap-3 w-100"
                >
                  <i
                    className="fa-solid fa-envelope"
                  ></i>
                  <div>
                    <p className="fw-semibold mb-1">Email</p>
                    <p className="text-secondary mb-0">contacto@entrelibros.cl</p>
                  </div>
                </div>

                <div
                  className="mt-3 d-flex align-items-center gap-3 w-100"
                >
                  <i
                    className="fa-solid fa-phone"
                  ></i>
                  <div>
                    <p className="fw-semibold mb-1">Teléfono</p>
                    <p className="text-secondary mb-0">+ 56 2 2200 3345</p>
                  </div>
                </div>

                <div
                  className="mt-3 d-flex align-items-center gap-3 w-100"
                >
                  <i
                    className="fa-solid fa-clock"
                  ></i>
                  <div>
                    <p className="fw-semibold mb-1">Horario</p>
                    <p className="text-secondary mb-0">Lun a Vie: 9:00 - 19:00</p>
                  </div>
                </div>
                

              </div>

              {/* FORMULARIO — derecha */}
              <div className="col-12 col-md-7">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        disabled={enviando}
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-semibold">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        className="form-control form-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={enviando}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Teléfono</label>
                      <input
                        type="tel"
                        className="form-control form-input"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+56 9 1234 5678"
                        disabled={enviando}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Asunto *</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        required
                        disabled={enviando}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Mensaje *</label>
                      <textarea
                        className="form-control form-long-text"
                        name="mensaje"
                        rows="5"
                        value={formData.mensaje}
                        onChange={handleChange}
                        required
                        disabled={enviando}
                        placeholder="Escribe tu mensaje aquí..."
                      ></textarea>
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn boton-primario w-100 py-2"
                        disabled={enviando}
                      >
                        {enviando ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <i className="fa-regular fa-paper-plane me-2"></i>
                            Enviar mensaje
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};