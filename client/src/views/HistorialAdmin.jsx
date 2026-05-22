import React, { useEffect, useState } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ITEMS_POR_PAGINA = 10;

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const HistorialAdmin = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [filtros, setFiltros] = useState({
    admin: "",
    accion: "",
    desde: "",
    hasta: "",
  });

  const construirQuery = () => {
    const params = new URLSearchParams();

    if (filtros.admin) params.append("admin", filtros.admin);
    if (filtros.accion) params.append("accion", filtros.accion);
    if (filtros.desde) params.append("desde", filtros.desde);
    if (filtros.hasta) params.append("hasta", filtros.hasta);

    return params.toString();
  };

  const cargarHistorial = async () => {
    setLoading(true);
    setError("");

    try {
      const query = construirQuery();
      const url = `${BASE_URL}/historial-admin${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al cargar historial administrativo.");
        return;
      }

      const json = await res.json();
      setHistorial(Array.isArray(json.data) ? json.data : []);
      setPaginaActual(1);
    } catch (err) {
      console.error("Error al cargar historial administrativo:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltro = (e) => {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      admin: "",
      accion: "",
      desde: "",
      hasta: "",
    });

    setTimeout(() => {
      cargarHistorial();
    }, 0);
  };

  const exportarExcel = async () => {
    try {
      const query = construirQuery();
      const url = `${BASE_URL}/historial-admin/excel${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        setError("Error al exportar historial administrativo.");
        return;
      }

      const blob = await res.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "historial_admin.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error("Error al exportar Excel:", err);
      setError("Error de conexión al exportar Excel.");
    }
  };

  const accionesUnicas = new Set(historial.map((item) => item.accion)).size;
  const adminsUnicos = new Set(historial.map((item) => item.nombre_admin)).size;

  const totalPaginas = Math.ceil(historial.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const historialPaginado = historial.slice(
    indiceInicio,
    indiceInicio + ITEMS_POR_PAGINA
  );

  const irAPagina = (pagina) => {
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <ProfileNavComponent />
        </div>

        <div className="col-12 col-md-9">
          <div className="profile-content">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <div>
                <h4 className="fw-semibold mb-1">
                  Historial administrativo
                </h4>
                <p className="text-secondary mb-0">
                  Registro de actividades realizadas por administradores
                </p>
              </div>

              <button
                className="btn boton-primario"
                onClick={exportarExcel}
                disabled={historial.length === 0}
              >
                <i className="fa-regular fa-file-excel me-2"></i>
                Exportar Excel
              </button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-3">
                <label className="form-label">Administrador</label>
                <input
                  type="text"
                  name="admin"
                  className="form-control"
                  placeholder="Ej: orlando2"
                  value={filtros.admin}
                  onChange={handleFiltro}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Acción</label>
                <select
                  name="accion"
                  className="form-select"
                  value={filtros.accion}
                  onChange={handleFiltro}
                >
                  <option value="">Todas</option>
                  <option value="CREAR_LIBRO">Crear libro</option>
                  <option value="ACTUALIZAR_LIBRO">Actualizar libro</option>
                  <option value="DESACTIVAR_LIBRO">Desactivar libro</option>
                  <option value="CAMBIAR_ROL_CLIENTE">Cambiar rol cliente</option>
                  <option value="DESACTIVAR_CLIENTE">Desactivar cliente</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Desde</label>
                <input
                  type="date"
                  name="desde"
                  className="form-control"
                  value={filtros.desde}
                  onChange={handleFiltro}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Hasta</label>
                <input
                  type="date"
                  name="hasta"
                  className="form-control"
                  value={filtros.hasta}
                  onChange={handleFiltro}
                />
              </div>

              <div className="col-12 d-flex gap-2 justify-content-end">
                <button className="btn boton-primario" onClick={cargarHistorial}>
                  Buscar
                </button>

                <button className="btn btn-outline-secondary" onClick={limpiarFiltros}>
                  Limpiar
                </button>
              </div>
            </div>

            {!loading && !error && historial.length > 0 && (
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="border rounded-4 p-3">
                    <p className="text-secondary mb-1">Registros</p>
                    <h5 className="mb-0">{historial.length}</h5>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded-4 p-3">
                    <p className="text-secondary mb-1">Tipos de acción</p>
                    <h5 className="mb-0">{accionesUnicas}</h5>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded-4 p-3">
                    <p className="text-secondary mb-1">Administradores</p>
                    <h5 className="mb-0">{adminsUnicos}</h5>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : historial.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-regular fa-clock-rotate-left fa-3x mb-3"
                  style={{ color: "#6B705C" }}
                ></i>
                <h5 className="fw-semibold">No hay actividades registradas</h5>
                <p className="text-secondary">
                  Intenta cambiar los filtros o revisa más tarde.
                </p>
              </div>
            ) : (
              <>
                <p className="text-secondary mb-3">
                  Mostrando {indiceInicio + 1}–
                  {Math.min(indiceInicio + ITEMS_POR_PAGINA, historial.length)}{" "}
                  de {historial.length} registros
                </p>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "120px" }}>Fecha</th>
                        <th style={{ minWidth: "180px" }}>Admin</th>
                        <th style={{ minWidth: "160px" }}>Acción</th>
                        <th style={{ minWidth: "260px" }}>Detalle</th>
                        <th style={{ minWidth: "160px" }}>Ruta</th>
                        <th style={{ minWidth: "150px" }}>IP</th>
                      </tr>
                    </thead>

                    <tbody>
                      {historialPaginado.map((item) => (
                        <tr key={item.id_historial}>
                          <td>{formatearFecha(item.fecha)}</td>
                          <td>
                            <span className="fw-semibold">
                              {item.nombre_admin}
                            </span>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{ backgroundColor: "#4A5947" }}
                            >
                              {item.accion}
                            </span>
                          </td>
                          <td>{item.detalle}</td>
                          <td>
                            <small className="text-secondary">
                              {item.ruta}
                            </small>
                          </td>
                          <td>
                            <small className="text-secondary">{item.ip}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPaginas > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          paginaActual === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => irAPagina(paginaActual - 1)}
                        >
                          &laquo;
                        </button>
                      </li>

                      {[...Array(totalPaginas)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${
                            paginaActual === i + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => irAPagina(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          paginaActual === totalPaginas ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => irAPagina(paginaActual + 1)}
                        >
                          &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};