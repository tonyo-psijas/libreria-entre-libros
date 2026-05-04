import React, { useState } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Profile = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useUser();
  // useState para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
    password: "",
    confirmPassword: "",
  });

  // useState para controlar si el formulario está en modo edición
  const [editando, setEditando] = useState(false);

  // useState para mostrar mensaje de éxito al guardar
  const [guardado, setGuardado] = useState(false);

  // 👈 FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Maneja los cambios en cada input del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario
  // Cuando el backend esté listo, aquí irá la llamada a la API (PUT /usuarios/:id)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos a enviar al backend:", formData);
    // TODO: llamar a services/usuarioService.js → PUT /usuarios/:id
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

    setEditando(false);
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* SIDEBAR */}
        <div className="col-12 col-md-3">
          {/* Navegación del perfil */}
          <ProfileNavComponent user={user} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="col-12 col-md-9">
          <div className="profile-content">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-semibold mb-0">Mi cuenta</h4>
            </div>

            {/* Alerta de guardado exitoso */}
            {guardado && (
              <div className="alert alert-success" role="alert">
                <i className="fa-regular fa-circle-check"></i> Tus datos fueron
                actualizados correctamente.
              </div>
            )}

            {/* Formulario de datos personales */}
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
                        placeholder="Ingresa una nueva contraseña"
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control form-input"
                        name="confirmPassword"
                        value={formData.confirmPassword || ""}
                        onChange={handleChange}
                        placeholder="Confirma tu nueva contraseña"
                      />
                    </div>
                  </>
                )}

                {!editando && (
                  <a className="link-editar" onClick={() => setEditando(true)}>
                    <i className="fa-regular fa-pen-to-square"></i> Editar
                    información de la cuenta
                  </a>
                )}

                {/* Botones solo visibles al editar */}
                {editando && (
                  <div className="col-12 d-flex gap-2 mt-4">
                    <button type="submit" className="btn boton-primario">
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      className="btn boton-secundario"
                      onClick={handleCancelar}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="row g-3 informacion-envio mt-4">
                <h6 className="fw-semibold">INFORMACIÓN DE PAGO Y ENVÍO</h6>
                <hr className="divider" />

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold">
                    Método de pago
                  </label>
                  <p>No tiene ningún metodo de pago asociado</p>
                  <a className="link-editar">
                    <i className="fa-regular fa-pen-to-square"></i> Agregar
                    método de pago
                  </a>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold">Dirección</label>
                  <p>No tiene ninguna dirección asociada</p>
                  <a className="link-editar">
                    <i className="fa-regular fa-pen-to-square"></i> Agregar
                    dirección
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
