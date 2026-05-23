import React, { useState, useEffect } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ITEMS_POR_PAGINA = 10;

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const HistorialVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    libro: "",
    genero: "",
    formato: "",
  });

  const construirQuery = () => {
    const params = new URLSearchParams();

    if (filtros.desde) params.append("desde", filtros.desde);
    if (filtros.hasta) params.append("hasta", filtros.hasta);
    if (filtros.libro) params.append("libro", filtros.libro);
    if (filtros.genero) params.append("genero", filtros.genero);
    if (filtros.formato) params.append("formato", filtros.formato);

    return params.toString();
  };

  const cargarVentas = async () => {
    setLoading(true);
    setError("");

    try {
      const query = construirQuery();
      const url = `${BASE_URL}/historial-ventas${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al cargar historial de ventas.");
        return;
      }

      const json = await res.json();
      setVentas(Array.isArray(json.data) ? json.data : []);
      setPaginaActual(1);
    } catch (err) {
      console.error("Error al cargar historial de ventas:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
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
      desde: "",
      hasta: "",
      libro: "",
      genero: "",
      formato: "",
    });

    setTimeout(() => {
      cargarVentas();
    }, 0);
  };

  const exportarExcel = async () => {
    try {
      const query = construirQuery();
      const url = `${BASE_URL}/historial-ventas/excel${query ? `?${query}` : ""}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        setError("Error al exportar historial de ventas.");
        return;
      }

      const blob = await res.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = "historial_ventas.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error("Error al exportar Excel:", err);
      setError("Error de conexión al exportar Excel.");
    }
  };

  const totalVentas = ventas.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0,
  );

  const totalLibros = ventas.reduce(
    (acc, item) => acc + Number(item.cantidad || 0),
    0,
  );

  const totalPaginas = Math.ceil(ventas.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const ventasPaginadas = ventas.slice(
    indiceInicio,
    indiceInicio + ITEMS_POR_PAGINA,
  );

  const irAPagina = (pagina) => {
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                <h4 className="fw-semibold mb-1">Historial de ventas</h4>
                <p className="text-secondary mb-0">
                  Reporte detallado por libro vendido
                </p>
              </div>

              <button
                className="btn boton-primario"
                onClick={exportarExcel}
                disabled={ventas.length === 0}
              >
                <i className="fa-regular fa-file-excel me-2"></i>
                Exportar Excel
              </button>
            </div>

            <div className="row g-3 mb-4">
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

              <div className="col-12 col-md-3">
                <label className="form-label">Libro</label>
                <input
                  type="text"
                  name="libro"
                  className="form-control"
                  placeholder="Ej: Spider-Man"
                  value={filtros.libro}
                  onChange={handleFiltro}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Género</label>
                <input
                  type="text"
                  name="genero"
                  className="form-control"
                  placeholder="Ej: Fantasía"
                  value={filtros.genero}
                  onChange={handleFiltro}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Formato</label>
                <select
                  name="formato"
                  className="form-select"
                  value={filtros.formato}
                  onChange={handleFiltro}
                >
                  <option value="">Todos</option>
                  <option value="fisico">Físico</option>
                  <option value="digital">Digital</option>
                  <option value="preventa">Preventa</option>
                </select>
              </div>

              <div className="col-12 d-flex gap-2 justify-content-end">
                <button className="btn boton-primario" onClick={cargarVentas}>
                  Buscar
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={limpiarFiltros}
                >
                  Limpiar
                </button>
              </div>
            </div>

            {!loading && !error && ventas.length > 0 && (
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="border rounded-4 p-3">
                    <p className="text-secondary mb-1">Total vendido</p>
                    <h5 className="card-price mb-0">
                      ${Number(totalVentas).toLocaleString("es-CL")}
                    </h5>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded-4 p-3">
                    <p className="text-secondary mb-1">Libros vendidos</p>
                    <h5 className="mb-0">{totalLibros}</h5>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="border rounded-4 p-3">
                    <p className="text-secondary mb-1">Registros</p>
                    <h5 className="mb-0">{ventas.length}</h5>
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
            ) : ventas.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-regular fa-chart-line fa-3x mb-3"
                  style={{ color: "#6B705C" }}
                ></i>
                <h5 className="fw-semibold">No hay ventas registradas</h5>
                <p className="text-secondary">
                  Intenta cambiar los filtros o revisa más tarde.
                </p>
              </div>
            ) : (
              <>
                <p className="text-secondary mb-3">
                  Mostrando {indiceInicio + 1}–
                  {Math.min(indiceInicio + ITEMS_POR_PAGINA, ventas.length)} de{" "}
                  {ventas.length} registros
                </p>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "90px" }}>Pedido</th>
                        <th style={{ minWidth: "95px" }}>Fecha</th>
                        <th>Cliente</th>
                        <th>Libro</th>
                        <th>Género</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ventasPaginadas.map((item, index) => (
                        <tr key={`${item.id_pedido}-${item.id_libro}-${index}`}>
                          <td>#{item.id_pedido}</td>
                          <td>
                            {new Date(item.fecha_pedido).toLocaleDateString(
                              "es-CL",
                            )}
                          </td>
                          <td>
                            <p className="mb-0 fw-semibold">{item.cliente}</p>
                            <small className="text-secondary">
                              {item.email}
                            </small>
                          </td>
                          <td>
                            <p className="mb-0 fw-semibold">{item.libro}</p>
                            <small className="text-secondary">
                              {item.formato}
                            </small>
                          </td>
                          <td>{item.generos || "Sin género"}</td>
                          <td>{item.cantidad}</td>
                          <td className="fw-semibold card-price">
                            ${Number(item.subtotal).toLocaleString("es-CL")}
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
