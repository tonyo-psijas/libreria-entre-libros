import React, { useState, useEffect } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";
import { useUser } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const UserManagement = () => {
  const { user } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/clientes`, {
        headers: authHeaders(),
      });
      const json = await res.json();
      if (res.ok) {
        setUsuarios(Array.isArray(json.data) ? json.data : []);
      } else {
        setError(json.message || "Error al cargar usuarios");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarRol = async (id_cliente, rolActual) => {
    const nuevoRol = rolActual === "admin" ? "cliente" : "admin";

    if (
      !window.confirm(
        `¿${nuevoRol === "admin" ? "Hacer administrador" : "Quitar permisos de administrador"} a este usuario?`,
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/clientes/${id_cliente}/rol`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ rol: nuevoRol }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(
          `Rol actualizado a ${nuevoRol === "admin" ? "Administrador" : "Cliente"}`,
        );
        cargarUsuarios();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Error al cambiar rol");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id_cliente, nombre) => {
    if (
      !window.confirm(
        `¿Eliminar permanentemente a "${nombre}"? Esta acción no se puede deshacer.`,
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/clientes/${id_cliente}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Usuario "${nombre}" eliminado`);
        cargarUsuarios();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Error al eliminar usuario");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    if (filtroRol !== "todos" && u.rol !== filtroRol) return false;
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      return (
        u.nombre?.toLowerCase().includes(termino) ||
        u.email?.toLowerCase().includes(termino)
      );
    }
    return true;
  });

  if (user?.rol !== "admin") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Acceso denegado. Solo administradores pueden ver esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <ProfileNavComponent />
        </div>

        <div className="col-12 col-md-9">
          <div className="profile-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-semibold mb-0">Gestión de usuarios</h4>
            </div>

            {success && (
              <div className="alert alert-success" role="alert">
                <i className="fa-regular fa-circle-check"></i> {success}
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-5">
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="col-12 col-sm-4 col-xl-5">
                <select
                  className="form-select form-input"
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                >
                  <option value="todos">Todos los usuarios</option>
                  <option value="admin">Administradores</option>
                  <option value="cliente">Clientes</option>
                </select>
              </div>
              <div className="col-12 col-sm-3 col-xl-2">
                <button
                  className="btn boton-secundario w-100"
                  onClick={() => {
                    setBusqueda("");
                    setFiltroRol("todos");
                  }}
                >
                  Limpiar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-success"></div>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <p className="text-secondary">No se encontraron usuarios</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id_cliente}>
                        <td>{u.id_cliente}</td>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`badge ${u.rol === "admin" ? "bg-danger" : "bg-secondary"}`}
                          >
                            {u.rol === "admin" ? "Administrador" : "Cliente"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-between gap-2">
                            <a
                              className="link-editar"
                              style={{ cursor: "pointer" }}
                              onClick={() => cambiarRol(u.id_cliente, u.rol)}
                            >
                              <i className="fa-regular fa-pen-to-square"></i>
                              {u.rol === "admin"
                                ? " Quitar admin"
                                : " Hacer admin"}
                            </a>
                            <a
                              className="link-eliminar"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                eliminarUsuario(u.id_cliente, u.nombre)
                              }
                            >
                              <i className="fa-regular fa-trash-can"></i>{" "}
                              Eliminar
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
