import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const resultado = login(email, password);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setExito("✅ ¡Has iniciado sesión correctamente! Redirigiendo...");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 p-4 login-register">
            <h2 className="text-center fw-semibold mb-4">Iniciar sesión</h2>

            {exito && (
              <div className="alert alert-success" role="alert">{exito}</div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-input fw-light"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-input fw-light"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>

              <button type="submit" className="btn boton-primario w-100 py-2 fw-semibold">
                INGRESAR
              </button>
            </form>

            <p className="text-center mt-4 mb-0">
              ¿Aún no tienes una cuenta?{" "}
              <Link to="/registro" className="text-decoration-none">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;