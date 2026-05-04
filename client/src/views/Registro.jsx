import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();
  const { register } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.password
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    register({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
    });

    setExito("✅ ¡Cuenta creada con éxito! Redirigiendo al login...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4 login-register">
            <h2 className="text-center fw-semibold mb-4">Crear cuenta</h2>

            {exito && (
              <div className="alert alert-success" role="alert">
                {exito}
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className="form-control form-input"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label htmlFor="apellido" className="form-label">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    className="form-control form-input"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  className="form-control form-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  className="form-control form-input"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña *
                </label>
                <input
                  type="password"
                  className="form-control form-input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  className="form-control form-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terminos"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="terminos">
                  Acepto los <Link to="/terminos">términos y condiciones</Link>
                </label>
              </div>

              <button
                type="submit"
                className="btn boton-primario w-100 py-2 fw-semibold"
              >
                CREAR CUENTA
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-decoration-none">
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
