import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const LIBROS_POR_PAGINA = 10;

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

export const MovimientoStock = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [tipo, setTipo] = useState("ingreso");
  const [motivo, setMotivo] = useState("orden_compra");
  const [referencia, setReferencia] = useState("");
  const [observacion, setObservacion] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [guardandoId, setGuardandoId] = useState(null);

  const navigate = useNavigate();

  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async (q = "") => {
    setLoading(true);

    try {
      const res = await authFetch(`${BASE_URL}/libros/admin/todos`);
      const json = await res.json();

      const data = Array.isArray(json) ? json : (json.data ?? []);

      const filtrados = q
        ? data.filter((libro) =>
            libro.titulo?.toLowerCase().includes(q.toLowerCase()),
          )
        : data;

      setLibros(filtrados);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    } finally {
      setLoading(false);
    }
  };

  const registrarMovimientos = async () => {
    const movimientos = Object.entries(cantidades)
      .filter(([, cantidad]) => Number(cantidad) > 0)
      .map(([id_libro, cantidad]) => ({
        id_libro: Number(id_libro),
        tipo,
        motivo,
        referencia,
        cantidad: Number(cantidad),
        observacion,
      }));

    if (movimientos.length === 0) {
      alert("Debes ingresar al menos una cantidad");
      return;
    }

    if (!referencia.trim()) {
      alert(
        tipo === "ingreso"
          ? "Debes ingresar el N° de O/C o traslado."
          : "Debes ingresar una referencia para el egreso.",
      );
      return;
    }

    try {
      setGuardandoId("todos");

      for (const movimiento of movimientos) {
        const res = await authFetch(`${BASE_URL}/stock/movimientos`, {
          method: "POST",
          body: JSON.stringify(movimiento),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
      }

      alert("✅ Movimientos registrados correctamente");

      setCantidades({});
      setReferencia("");
      setObservacion("");
      cargarLibros();
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setGuardandoId(null);
    }
  };

  const librosFiltrados = busqueda
    ? libros.filter(
        (libro) =>
          libro.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          libro.autores?.toLowerCase().includes(busqueda.toLowerCase()),
      )
    : libros;

  const totalPaginas = Math.ceil(librosFiltrados.length / LIBROS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA;

  const librosPaginados = librosFiltrados.slice(
    indiceInicio,
    indiceInicio + LIBROS_POR_PAGINA,
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Movimiento de Stock</h2>

      <div className="d-flex gap-2 mb-4">
        <button
          className="btn boton-secundario"
          onClick={() => navigate("/catalogo")}
        >
          ← Volver a catálogo
        </button>

        <button
          className="btn boton-primario"
          onClick={() => navigate("/historial-movimientos")}
        >
          Ver historial movimientos
        </button>
      </div>

      {loading ? (
        <p>Cargando libros...</p>
      ) : (
        <div className="card p-4">
          <p>
            Mostrando <strong>{librosFiltrados.length}</strong> libros
          </p>

          <div className="card p-3 mb-4">
            <h5 className="fw-semibold mb-3">Datos del movimiento</h5>

            <div className="row g-3">
              <div className="col-12 col-md-3">
                <label className="form-label">Tipo</label>
                <div className="d-flex gap-3">
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="ingreso"
                      checked={tipo === "ingreso"}
                      onChange={(e) => setTipo(e.target.value)}
                    />{" "}
                    Ingreso
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="egreso"
                      checked={tipo === "egreso"}
                      onChange={(e) => setTipo(e.target.value)}
                    />{" "}
                    Egreso
                  </label>
                </div>
              </div>

              {tipo === "ingreso" ? (
                <div className="col-12 col-md-4">
                  <label className="form-label">Motivo ingreso</label>
                  <div className="d-flex gap-3">
                    <label>
                      <input
                        type="radio"
                        name="motivo"
                        value="orden_compra"
                        checked={motivo === "orden_compra"}
                        onChange={(e) => setMotivo(e.target.value)}
                      />{" "}
                      O/C
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="motivo"
                        value="traslado"
                        checked={motivo === "traslado"}
                        onChange={(e) => setMotivo(e.target.value)}
                      />{" "}
                      Traslado
                    </label>
                  </div>
                </div>
              ) : (
                <div className="col-12 col-md-5">
                  <label className="form-label">Motivo egreso</label>
                  <div className="d-flex gap-3 flex-wrap">
                    <label>
                      <input
                        type="radio"
                        name="motivo"
                        value="merma"
                        checked={motivo === "merma"}
                        onChange={(e) => setMotivo(e.target.value)}
                      />{" "}
                      Merma
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="motivo"
                        value="donacion"
                        checked={motivo === "donacion"}
                        onChange={(e) => setMotivo(e.target.value)}
                      />{" "}
                      Donación
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="motivo"
                        value="ajuste"
                        checked={motivo === "ajuste"}
                        onChange={(e) => setMotivo(e.target.value)}
                      />{" "}
                      Ajuste
                    </label>
                  </div>
                </div>
              )}

              <div className="col-12 col-md-3">
                <label className="form-label">
                  {tipo === "ingreso" ? "N° O/C o traslado" : "Referencia"}
                </label>
                <input
                  type="text"
                  className="form-control form-input"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder={tipo === "ingreso" ? "OC-001" : "Ej: MERMA-001"}
                  required
                />
              </div>
              <div className="mt-3">
                <label className="form-label">Observación</label>

                <textarea
                  className="form-control form-input"
                  rows="2"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Observaciones del movimiento..."
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Buscar libro</label>
            <input
              type="search"
              className="form-control form-input"
              placeholder="Buscar por título"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <div
            className="d-flex align-items-center gap-3 text-secondary small fw-semibold mt-3"
            style={{ width: "100%" }}
          >
            <div style={{ width: "45px", minWidth: "45px" }}></div>

            <div style={{ width: "260px", minWidth: "260px" }}>Libro</div>

            <div style={{ width: "100px", minWidth: "100px" }}>Stock</div>

            <div
              className="ms-auto text-center"
              style={{ width: "160px", minWidth: "160px" }}
            >
              Cantidad
            </div>
          </div>

          {librosPaginados.map((libro) => (
            <React.Fragment key={libro.id_libro}>
              <hr className="divider" />

              <div
                className="d-flex align-items-center gap-3"
                style={{ width: "100%" }}
              >
                {libro.imagen && (
                  <img
                    src={libro.imagen}
                    alt={libro.titulo}
                    style={{
                      width: "45px",
                      height: "65px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      flexShrink: 0,
                    }}
                  />
                )}

                <div
                  style={{
                    width: "260px",
                    minWidth: "260px",
                  }}
                >
                  <h6 className="fw-semibold mb-1">{libro.titulo}</h6>
                  <p className="mb-0 text-secondary">
                    {libro.autores || "Sin autor"}
                  </p>
                </div>

                <div
                  style={{
                    width: "100px",
                    minWidth: "100px",
                  }}
                >
                  <p className="fw-semibold mb-1">{libro.stock}</p>
                  <p className="mb-0">{libro.formato}</p>
                </div>

                <div
                  className="ms-auto"
                  style={{
                    width: "160px",
                    minWidth: "160px",
                  }}
                >
                  <input
                    type="number"
                    className="form-control form-input"
                    placeholder="Cantidad"
                    value={cantidades[libro.id_libro] || ""}
                    onChange={(e) =>
                      setCantidades((prev) => ({
                        ...prev,
                        [libro.id_libro]: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </React.Fragment>
          ))}

          {totalPaginas > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {[...Array(totalPaginas)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      paginaActual === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn boton-primario"
              onClick={registrarMovimientos}
              disabled={guardandoId === "todos"}
            >
              {guardandoId === "todos"
                ? "Registrando..."
                : "Registrar movimiento"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
