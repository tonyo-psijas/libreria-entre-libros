import React, { useState, useEffect } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─── Formulario vacío de dirección ───────────────────────────────────────────
const DIRECCION_VACIA = {
  alias: "",
  destinatario: "",
  telefono: "",
  pais: "Chile",
  ciudad: "",
  calle: "",
  numero: "",
  codigo_postal: "",
};

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, actualizarPerfil } = useUser();

  // ── Estado del formulario de perfil ────────────────────────────────────────
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState("");

  // ── Estado de direcciones ───────────────────────────────────────────────────
  const [direcciones, setDirecciones] = useState([]);
  const [loadingDirecciones, setLoadingDirecciones] = useState(true);
  const [errorDirecciones, setErrorDirecciones] = useState("");

  // Controla si el formulario de nueva/editar dirección está abierto
  const [mostrarFormDireccion, setMostrarFormDireccion] = useState(false);
  // null = crear nueva, número = editar existente
  const [editandoDireccionId, setEditandoDireccionId] = useState(null);
  const [formDireccion, setFormDireccion] = useState(DIRECCION_VACIA);
  const [guardandoDireccion, setGuardandoDireccion] = useState(false);

  // ── Cargar direcciones al montar ────────────────────────────────────────────
  const cargarDirecciones = async () => {
    setLoadingDirecciones(true);
    setErrorDirecciones("");
    try {
      const res = await fetch(`${BASE_URL}/direcciones`, {
        headers: authHeaders(),
      });
      const json = await res.json();
      setDirecciones(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Error al cargar direcciones:", err);
      setErrorDirecciones("No se pudieron cargar las direcciones.");
    } finally {
      setLoadingDirecciones(false);
    }
  };

  useEffect(() => {
    cargarDirecciones();
  }, []);

  // ── Handlers perfil ─────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    setErrorPerfil("");
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorPerfil("Las contraseñas no coinciden.");
      return;
    }
    if (formData.password && formData.password.length < 6) {
      setErrorPerfil("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
  
    const datosAActualizar = {
      nombre: formData.nombre,
      email: formData.email,
      ...(formData.password ? { password: formData.password } : {}),
    };
  
    const resultado = await actualizarPerfil(datosAActualizar); 
  
    if (!resultado.ok) {
      setErrorPerfil(resultado.mensaje);
      return;
    }
  
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  const handleCancelarPerfil = () => {
    setFormData({
      nombre: user?.nombre || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    });
    setErrorPerfil("");
    setEditando(false);
  };

  // ── Handlers direcciones ────────────────────────────────────────────────────
  const handleChangeDireccion = (e) => {
    const { name, value } = e.target;
    setFormDireccion((prev) => ({ ...prev, [name]: value }));
  };

  const abrirFormNuevaDireccion = () => {
    setFormDireccion(DIRECCION_VACIA);
    setEditandoDireccionId(null);
    setMostrarFormDireccion(true);
  };

  const abrirFormEditarDireccion = (dir) => {
    setFormDireccion({
      alias: dir.alias || "",
      destinatario: dir.destinatario || "",
      telefono: dir.telefono || "",
      pais: dir.pais || "Chile",
      ciudad: dir.ciudad || "",
      calle: dir.calle || "",
      numero: dir.numero || "",
      codigo_postal: dir.codigo_postal || "",
    });
    setEditandoDireccionId(dir.id_direccion);
    setMostrarFormDireccion(true);
  };

  const cancelarFormDireccion = () => {
    setMostrarFormDireccion(false);
    setEditandoDireccionId(null);
    setFormDireccion(DIRECCION_VACIA);
  };

  // POST /direcciones
  const handleCrearDireccion = async (e) => {
    e.preventDefault();
    setGuardandoDireccion(true);
    try {
      const res = await fetch(`${BASE_URL}/direcciones`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(formDireccion),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorDirecciones(data.message || "Error al crear la dirección.");
        return;
      }
      await cargarDirecciones();
      cancelarFormDireccion();
    } catch (err) {
      console.error("Error al crear dirección:", err);
      setErrorDirecciones("Error de conexión.");
    } finally {
      setGuardandoDireccion(false);
    }
  };

  // PUT /direcciones/:id_direccion
  const handleActualizarDireccion = async (e) => {
    e.preventDefault();
    setGuardandoDireccion(true);
    try {
      const res = await fetch(
        `${BASE_URL}/direcciones/${editandoDireccionId}`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(formDireccion),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorDirecciones(data.message || "Error al actualizar la dirección.");
        return;
      }
      await cargarDirecciones();
      cancelarFormDireccion();
    } catch (err) {
      console.error("Error al actualizar dirección:", err);
      setErrorDirecciones("Error de conexión.");
    } finally {
      setGuardandoDireccion(false);
    }
  };

  // DELETE /direcciones/:id_direccion
  const handleEliminarDireccion = async (id_direccion) => {
    if (!window.confirm("¿Eliminar esta dirección?")) return;
    try {
      const res = await fetch(`${BASE_URL}/direcciones/${id_direccion}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorDirecciones(data.message || "Error al eliminar la dirección.");
        return;
      }
      await cargarDirecciones();
    } catch (err) {
      console.error("Error al eliminar dirección:", err);
      setErrorDirecciones("Error de conexión.");
    }
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
                <i className="fa-regular fa-circle-check"></i> Tus datos
                fueron actualizados correctamente.
              </div>
            )}
            {errorPerfil && (
              <div className="alert alert-danger" role="alert">
                {errorPerfil}
              </div>
            )}

            {/* ── INFORMACIÓN DE LA CUENTA ── */}
            <form onSubmit={handleSubmitPerfil}>
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
                      <label className="form-label">
                        Confirmar nueva contraseña
                      </label>
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
                  <a
                    className="link-editar"
                    onClick={() => setEditando(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-regular fa-pen-to-square"></i> Editar
                    información de la cuenta
                  </a>
                )}

                {editando && (
                  <div className="col-12 d-flex gap-2 mt-4">
                    <button type="submit" className="btn boton-primario">
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      className="btn boton-secundario"
                      onClick={handleCancelarPerfil}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* ── DIRECCIONES ── */}
            <div className="row g-3 informacion-envio mt-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
                <h6 className="fw-semibold mb-0">MIS DIRECCIONES</h6>
                {!mostrarFormDireccion && (
                  <a
                    className="link-editar"
                    onClick={abrirFormNuevaDireccion}
                  >
                    <i className="fa-regular fa-plus"></i> Agregar dirección
                  </a>
                )}
              </div>
              <hr className="divider" />

              {errorDirecciones && (
                <div className="alert alert-danger py-2">{errorDirecciones}</div>
              )}

              {/* Lista de direcciones */}
              {loadingDirecciones ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-success"></div>
                </div>
              ) : direcciones.length === 0 && !mostrarFormDireccion ? (
                <p className="text-secondary">
                  No tienes direcciones guardadas.{" "}
                  <a
                    className="link-editar"
                    style={{ cursor: "pointer" }}
                    onClick={abrirFormNuevaDireccion}
                  >
                    Agrega una ahora.
                  </a>
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {direcciones.map((dir) => (
                    <div
                      key={dir.id_direccion}
                      style={{
                        border: "1px solid #D4D9C7",
                        borderRadius: "12px",
                        padding: "1rem",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          {dir.alias && (
                            <p className="fw-semibold mb-1">{dir.alias}</p>
                          )}
                          <p className="mb-0">{dir.destinatario}</p>
                          <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>
                            {dir.calle} {dir.numero}, {dir.ciudad}, {dir.pais}
                            {dir.codigo_postal && `, ${dir.codigo_postal}`}
                          </p>
                          {dir.telefono && (
                            <p className="text-secondary mb-0" style={{ fontSize: "14px" }}>
                              {dir.telefono}
                            </p>
                          )}
                        </div>
                        <div className="d-flex gap-3">
                          <a
                            className="link-editar"
                            style={{ cursor: "pointer" }}
                            onClick={() => abrirFormEditarDireccion(dir)}
                          >
                            <i className="fa-regular fa-pen-to-square"></i> Editar
                          </a>
                          <a
                            className="link-eliminar"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEliminarDireccion(dir.id_direccion)}
                          >
                            <i className="fa-regular fa-trash-can"></i> Eliminar
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario crear / editar dirección */}
              {mostrarFormDireccion && (
                <form
                  onSubmit={
                    editandoDireccionId
                      ? handleActualizarDireccion
                      : handleCrearDireccion
                  }
                  className="mt-3"
                  style={{
                    border: "1px solid #D4D9C7",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <h6 className="fw-semibold mb-3">
                    {editandoDireccionId ? "Editar dirección" : "Nueva dirección"}
                  </h6>

                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label">Alias (ej: Casa, Trabajo)</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="alias"
                        value={formDireccion.alias}
                        onChange={handleChangeDireccion}
                        placeholder="Casa"
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">Destinatario *</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="destinatario"
                        value={formDireccion.destinatario}
                        onChange={handleChangeDireccion}
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        className="form-control form-input"
                        name="telefono"
                        value={formDireccion.telefono}
                        onChange={handleChangeDireccion}
                        placeholder="+56 9 1234 5678"
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">País *</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="pais"
                        value={formDireccion.pais}
                        onChange={handleChangeDireccion}
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">Ciudad *</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="ciudad"
                        value={formDireccion.ciudad}
                        onChange={handleChangeDireccion}
                        placeholder="Santiago"
                        required
                      />
                    </div>

                    <div className="col-8">
                      <label className="form-label">Calle *</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="calle"
                        value={formDireccion.calle}
                        onChange={handleChangeDireccion}
                        placeholder="Av. Providencia"
                        required
                      />
                    </div>

                    <div className="col-4">
                      <label className="form-label">Número *</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="numero"
                        value={formDireccion.numero}
                        onChange={handleChangeDireccion}
                        placeholder="1234"
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label">Código postal</label>
                      <input
                        type="text"
                        className="form-control form-input"
                        name="codigo_postal"
                        value={formDireccion.codigo_postal}
                        onChange={handleChangeDireccion}
                        placeholder="7500000"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn boton-primario"
                      disabled={guardandoDireccion}
                    >
                      {guardandoDireccion ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : editandoDireccionId ? (
                        "Guardar cambios"
                      ) : (
                        "Agregar dirección"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn boton-secundario"
                      onClick={cancelarFormDireccion}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <br />

            {/* CERRAR SESIÓN */}
            <button
              type="button"
              className="btn boton-primario mt-3 mb-2"
              onClick={handleLogout}
              style={{ backgroundColor: "#E37217" }}
            >
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};