import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProfileNavComponent } from "../components/ProfileNav";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const PEDIDOS_POR_PAGINA = 8;

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const HistorialVentas = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    const cargarVentas = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/pedidos/admin/todos`, {
          headers: authHeaders(),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Error al cargar el historial de ventas.");
          return;
        }

        const json = await res.json();
        setPedidos(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Error al cargar ventas:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, []);

  const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total), 0);

  // Paginación
  const totalPaginas = Math.ceil(pedidos.length / PEDIDOS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * PEDIDOS_POR_PAGINA;
  const pedidosPaginados = pedidos.slice(indiceInicio, indiceInicio + PEDIDOS_POR_PAGINA);

  const irAPagina = (pagina) => {
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* SIDEBAR */}
        <div className="col-12 col-md-3">
          <ProfileNavComponent />
        </div>

        {/* CONTENIDO */}
        <div className="col-12 col-md-9">
          <div className="profile-content">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-semibold mb-0">Historial de ventas</h4>
              {pedidos.length > 0 && (
                <span className="text-secondary">
                  Total:{" "}
                  <strong className="card-price">
                    ${Number(totalVentas).toLocaleString("es-CL")}
                  </strong>
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="fa-regular fa-chart-line fa-3x mb-3"
                  style={{ color: "#6B705C" }}
                ></i>
                <h5 className="fw-semibold">No hay ventas registradas</h5>
                <p className="text-secondary">
                  Las órdenes de los clientes aparecerán aquí.
                </p>
              </div>
            ) : (
              <>
                {/* Contador */}
                <p className="text-secondary mb-3">
                  Mostrando {indiceInicio + 1}–
                  {Math.min(indiceInicio + PEDIDOS_POR_PAGINA, pedidos.length)} de{" "}
                  {pedidos.length} pedidos
                </p>

                {/* Lista de pedidos */}
                {pedidosPaginados.map((pedido) => (
                  <div key={pedido.id_pedido}>
                    <hr className="divider" />
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 py-3">
                      <div>
                        <p className="fw-semibold mb-1">
                          Pedido N° {pedido.id_pedido}
                        </p>
                        <p className="text-secondary mb-1">
                          Cliente:{" "}
                          <strong>{pedido.cliente_nombre}</strong> —{" "}
                          {pedido.cliente_email}
                        </p>
                        <p className="text-secondary mb-0">
                          Fecha: {pedido.fecha}
                        </p>
                      </div>
                      <div className="text-sm-end">
                        <p className="fw-semibold card-price mb-1">
                          ${Number(pedido.total).toLocaleString("es-CL")}
                        </p>
                        <span
                          className="badge mb-2"
                          style={{ backgroundColor: "#4A5947" }}
                        >
                          {pedido.estado}
                        </span>
                        <br />
                        <Link
                          to={`/pedido/${pedido.id_pedido}`}
                          className="link-editar"
                        >
                          <i className="fa-regular fa-eye"></i> Ver detalle
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
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
                          className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => irAPagina(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
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