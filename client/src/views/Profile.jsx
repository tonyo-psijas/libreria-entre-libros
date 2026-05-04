import React, { useState } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, actualizarPerfil } = useUser();

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    password: "",
    confirmPassword: "",
  });

  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const datosAActualizar = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      ...(formData.password ? { password: formData.password } : {}),
    }

    // TODO: cuando el backend esté listo, reemplazar por PUT /clientes/:id
    actualizarPerfil(datosAActualizar)

    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const handleCancelar = () => {
    setFormData({
      nombre: user?.nombre || "",
      apellido: user?.apellido || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setEditando(false);
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* SIDEBAR */}
        <div className="col-12 col-md-3">
          <ProfileNavComponent user={user} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="col-12 col-md-9">
          <div className="profile-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-semibold mb-0">Mi cuenta</h4>
            </div>

            {guardado && (
              <div className="alert alert-success" role="alert">
                <i className="fa-regular fa-circle-check"></i> Tus datos fueron actualizados correctamente.
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 informacion-de-cuenta">
                <h6 className="fw-semibold">INFORMACIÓN DE LA CUENTA</h6>
                <hr className="divider" />

                <div className="col-12 col-sm-6">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control form-input"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control form-input"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control form-input"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                {editando && (
                  <>
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Nueva contraseña</label>
                      <input
                        type="password"
                        className="form-control form-input"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Déjalo en blanco para no cambiarla"
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        className="form-control form-input"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirma tu nueva contraseña"
                      />
                    </div>
                  </>
                )}

                {!editando && (
                  <a className="link-editar" onClick={() => setEditando(true)} style={{ cursor: 'pointer' }}>
                    <i className="fa-regular fa-pen-to-square"></i> Editar información de la cuenta
                  </a>
                )}

                {editando && (
                  <div className="col-12 d-flex gap-2 mt-4">
                    <button type="submit" className="btn boton-primario">
                      Guardar cambios
                    </button>
                    <button type="button" className="btn boton-secundario" onClick={handleCancelar}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="row g-3 informacion-envio mt-4">
                <h6 className="fw-semibold">INFORMACIÓN DE PAGO Y ENVÍO</h6>
                <hr className="divider" />

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold">Método de pago</label>
                  <p>No tiene ningún método de pago asociado</p>
                  <a className="link-editar" style={{ cursor: 'pointer' }}>
                    <i className="fa-regular fa-pen-to-square"></i> Agregar método de pago
                  </a>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold">Dirección</label>
                  <p>No tiene ninguna dirección asociada</p>
                  <a className="link-editar" style={{ cursor: 'pointer' }}>
                    <i className="fa-regular fa-pen-to-square"></i> Agregar dirección
                  </a>
                </div>
              </div>

              <br />

              <button
                type="button"
                className="btn boton-primario mt-3 mb-2"
                onClick={handleLogout}
                style={{ backgroundColor: "#E37217" }}
              >
                CERRAR SESIÓN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};