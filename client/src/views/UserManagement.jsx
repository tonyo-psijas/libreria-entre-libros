import React, { useState, useEffect } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";
import { useUser } from "../context/UserContext";

// MOCK DATA
const MOCK_USUARIOS = [
  {
    id_cliente: 1,
    nombre: "Antonio Admin",
    email: "antonio@test.com",
    rol: "admin",
    estado: true,
  },
  {
    id_cliente: 2,
    nombre: "Stefania Carter",
    email: "stefania@test.com",
    rol: "admin",
    estado: true,
  },
  {
    id_cliente: 3,
    nombre: "Orlando López",
    email: "orlando@test.com",
    rol: "admin",
    estado: true,
  },
  {
    id_cliente: 4,
    nombre: "María González",
    email: "maria@test.com",
    rol: "usuario",
    estado: true,
  },
  {
    id_cliente: 5,
    nombre: "Juan Pérez",
    email: "juan@test.com",
    rol: "usuario",
    estado: true,
  },
];

export const UserManagement = () => {
  const { user } = useUser();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Cargar usuarios con mock
  const cargarUsuarios = () => {
    setLoading(true);
    setTimeout(() => {
      setUsuarios(MOCK_USUARIOS);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Cambiar rol
  const cambiarRol = (id_cliente, rolActual) => {
    const nuevoRol = rolActual === "admin" ? "usuario" : "admin";

    if (
      !window.confirm(
        `¿${nuevoRol === "admin" ? "Hacer administrador" : "Quitar permisos de administrador"} a este usuario?`,
      )
    )
      return;

    const nuevosUsuarios = usuarios.map((u) =>
      u.id_cliente === id_cliente ? { ...u, rol: nuevoRol } : u,
    );
    setUsuarios(nuevosUsuarios);
    setSuccess(
      `Rol actualizado a ${nuevoRol === "admin" ? "Administrador" : "Usuario"}`,
    );
    setTimeout(() => setSuccess(""), 3000);
  };

  // Eliminar usuario
  const eliminarUsuario = (id_cliente, nombre) => {
    if (
      !window.confirm(
        `¿Eliminar permanentemente a "${nombre}"? Esta acción no se puede deshacer.`,
      )
    )
      return;

    const nuevosUsuarios = usuarios.filter((u) => u.id_cliente !== id_cliente);
    setUsuarios(nuevosUsuarios);
    setSuccess(`Usuario "${nombre}" eliminado`);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Filtrar usuarios
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

  // Protección de ruta - temporalmente comentada para pruebas
  // if (user?.rol !== "admin") {
  //   return (
  //     <div className="container py-5">
  //       <div className="alert alert-danger">
  //         Acceso denegado. Solo administradores pueden ver esta página.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* SIDEBAR */}
        <div className="col-12 col-md-3">
          <ProfileNavComponent />
        </div>

        {/* CONTENIDO PRINCIPAL */}
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

            {/* Filtros */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6">
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="col-12 col-sm-4">
                <select
                  className="form-select form-input"
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                >
                  <option value="todos">Todos los usuarios</option>
                  <option value="admin">Administradores</option>
                  <option value="usuario">Usuarios regulares</option>
                </select>
              </div>
              <div className="col-12 col-sm-2">
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

            {/* Tabla */}
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
                            {u.rol === "admin" ? "Administrador" : "Usuario"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
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
