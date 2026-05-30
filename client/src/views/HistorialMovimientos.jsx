import React, { useEffect, useState } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

export const HistorialMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroMotivo, setFiltroMotivo] = useState("");
  const [busquedaLibro, setBusquedaLibro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const cargarMovimientos = async () => {
    setLoading(true);

    try {
      const res = await authFetch(`${BASE_URL}/stock/movimientos`);
      const json = await res.json();

      setMovimientos(json.data || []);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const movimientosFiltrados = movimientos.filter((mov) => {
    const coincideTipo = filtroTipo ? mov.tipo === filtroTipo : true;
    const coincideMotivo = filtroMotivo ? mov.motivo === filtroMotivo : true;

    const coincideLibro = busquedaLibro
      ? mov.titulo?.toLowerCase().includes(busquedaLibro.toLowerCase())
      : true;

    const fechaMovimiento = new Date(mov.fecha_movimiento);

    const coincideDesde = fechaDesde
      ? fechaMovimiento >= new Date(fechaDesde)
      : true;

    const coincideHasta = fechaHasta
      ? fechaMovimiento <= new Date(fechaHasta + "T23:59:59")
      : true;

    return (
      coincideTipo &&
      coincideMotivo &&
      coincideLibro &&
      coincideDesde &&
      coincideHasta
    );
  });
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <ProfileNavComponent />
        </div>

        <div className="col-12 col-md-9">
          <div className="profile-content">
            <h4 className="fw-semibold mb-3">Historial de movimientos</h4>

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-3">
                <label className="form-label">Desde</label>
                <input
                  type="date"
                  className="form-control form-input"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Hasta</label>
                <input
                  type="date"
                  className="form-control form-input"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  value={filtroTipo}
                  onChange={(e) => {
                    setFiltroTipo(e.target.value);
                    setFiltroMotivo("");
                  }}
                >
                  <option value="">Todos</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label">Motivo</label>
                <select
                  className="form-select"
                  value={filtroMotivo}
                  onChange={(e) => setFiltroMotivo(e.target.value)}
                >
                  <option value="">Todos</option>

                  {filtroTipo === "ingreso" && (
                    <>
                      <option value="orden_compra">Orden de compra</option>
                      <option value="traslado">Traslado</option>
                    </>
                  )}

                  {filtroTipo === "egreso" && (
                    <>
                      <option value="merma">Merma</option>
                      <option value="donacion">Donación</option>
                      <option value="ajuste">Ajuste</option>
                    </>
                  )}

                  {!filtroTipo && (
                    <>
                      <option value="orden_compra">Orden de compra</option>
                      <option value="traslado">Traslado</option>
                      <option value="merma">Merma</option>
                      <option value="donacion">Donación</option>
                      <option value="ajuste">Ajuste</option>
                    </>
                  )}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Buscar libro</label>
                <input
                  type="search"
                  className="form-control form-input"
                  placeholder="Buscar por título"
                  value={busquedaLibro}
                  onChange={(e) => setBusquedaLibro(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : movimientosFiltrados.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-regular fa-boxes-stacked fa-3x mb-3"
                  style={{ color: "#6B705C" }}
                ></i>
                <h5 className="fw-semibold">No hay movimientos registrados</h5>
                <p className="text-secondary">
                  Cuando se realicen ingresos o egresos de stock, aparecerán
                  aquí.
                </p>
              </div>
            ) : (
              movimientosFiltrados.map((mov) => (
                <div key={mov.id_movimiento}>
                  <hr className="divider" />

                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3 py-3">
                    <div>
                      <p className="fw-semibold mb-1">{mov.titulo}</p>

                      <p className="text-secondary mb-1">
                        Fecha:{" "}
                        {new Date(mov.fecha_movimiento).toLocaleString("es-CL")}
                      </p>

                      <p className="mb-1">
                        Motivo:{" "}
                        <span className="fw-semibold">{mov.motivo}</span>
                      </p>

                      {mov.referencia && (
                        <p className="mb-1">
                          Referencia:{" "}
                          <span className="fw-semibold">{mov.referencia}</span>
                        </p>
                      )}

                      {mov.observacion && (
                        <p className="text-secondary mb-0">{mov.observacion}</p>
                      )}
                    </div>

                    <div className="text-lg-end">
                      <span
                        className={`badge mb-2 ${
                          mov.tipo === "ingreso" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {mov.tipo === "ingreso" ? "INGRESO" : "EGRESO"}
                      </span>

                      <p className="fw-semibold mb-1">
                        Cantidad: {mov.cantidad}
                      </p>

                      <p className="mb-1">
                        Stock:{" "}
                        <span className="fw-semibold">
                          {mov.stock_anterior} → {mov.stock_nuevo}
                        </span>
                      </p>

                      <p className="text-secondary mb-0">
                        Admin: {mov.administrador || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
