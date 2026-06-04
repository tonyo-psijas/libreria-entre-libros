import React, { useState, useEffect } from "react";
import { ProfileNavComponent } from "../components/ProfileNav";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const LIBROS_POR_PAGINA = 6;

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

const FORM_LIBRO_VACIO = {
  titulo: "",
  descripcion: "",
  imagen: "",
  precio: "",
  stock: "",
  descuento: 0,
  autores: "",
  generos: [],
  editorial: "",
  fecha_publicacion: "",
  numero_paginas: "",
  formato: "fisico",
};

export const Catalogo = () => {
  const [libros, setLibros] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [libroEditando, setLibroEditando] = useState(null);
  const [formEditar, setFormEditar] = useState({ ...FORM_LIBRO_VACIO });
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [mensajeEdicion, setMensajeEdicion] = useState("");

  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [tabAgregar, setTabAgregar] = useState("isbn");

  const [isbn, setIsbn] = useState("");
  const [libroBuscado, setLibroBuscado] = useState(null);
  const [buscandoIsbn, setBuscandoIsbn] = useState(false);
  const [errorIsbn, setErrorIsbn] = useState("");
  const [formIsbn, setFormIsbn] = useState({ ...FORM_LIBRO_VACIO });
  const [guardandoIsbn, setGuardandoIsbn] = useState(false);
  const navigate = useNavigate();

  const [formManual, setFormManual] = useState({ ...FORM_LIBRO_VACIO });
  const [guardandoManual, setGuardandoManual] = useState(false);
  const [mensajeManual, setMensajeManual] = useState("");

  const cargarGeneros = async () => {
    try {
      const res = await fetch(`${BASE_URL}/generos`);
      const json = await res.json();
      setGeneros(Array.isArray(json) ? json : (json.data ?? []));
    } catch (error) {
      console.error("Error al cargar géneros:", error);
    }
  };

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

  useEffect(() => {
    cargarLibros();
    cargarGeneros();
  }, []);

  const handleBusqueda = (e) => {
    const q = e.target.value;
    setBusqueda(q);
    setPaginaActual(1);
    cargarLibros(q);
  };

  const totalPaginas = Math.ceil(libros.length / LIBROS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA;
  const librosPaginados = libros.slice(
    indiceInicio,
    indiceInicio + LIBROS_POR_PAGINA,
  );

  const toggleGenero = (setter, listaActual, nombre) => {
    setter((prev) => ({
      ...prev,
      generos: listaActual.includes(nombre)
        ? listaActual.filter((g) => g !== nombre)
        : [...listaActual, nombre],
    }));
  };

  const buildPayload = (form) => ({
    titulo: form.titulo,
    descripcion: form.descripcion,
    imagen: form.imagen,
    precio: Number(form.precio),
    stock: 0, // El stock se maneja por separado en Movimiento de Stock
    descuento: Number(form.descuento),
    editorial: form.editorial,
    fecha_publicacion: form.fecha_publicacion || null,
    numero_paginas: form.numero_paginas ? Number(form.numero_paginas) : null,
    formato: form.formato,
    autores: form.autores
      ? form.autores
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [],
    generos: form.generos,
  });

  // ── EDITAR ──────────────────────────────────────────────
  const abrirModalEditar = async (libro) => {
    setMensajeEdicion("");
    try {
      const res = await fetch(`${BASE_URL}/libros/${libro.id_libro}`);
      const detalle = await res.json();
      setLibroEditando(detalle);
      setFormEditar({
        titulo: detalle.titulo || "",
        descripcion: detalle.descripcion || "",
        imagen: detalle.imagen || "",
        precio: detalle.precio || "",
        stock: detalle.stock ?? "",
        descuento: detalle.descuento ?? 0,
        autores: detalle.autores || "",
        generos: detalle.generos
          ? detalle.generos.split(", ").map((g) => g.trim())
          : [],
        editorial: detalle.editorial || "",
        fecha_publicacion: detalle.fecha_publicacion
          ? detalle.fecha_publicacion.split("T")[0]
          : "",
        numero_paginas: detalle.numero_paginas || "",
        formato: detalle.formato || "fisico",
      });
    } catch (error) {
      console.error("Error al cargar detalle:", error);
    }
  };

  const handleGuardarEdicion = async () => {
    setGuardandoEdicion(true);
    setMensajeEdicion("");
    try {
      const res = await authFetch(
        `${BASE_URL}/libros/${libroEditando.id_libro}`,
        {
          method: "PUT",
          body: JSON.stringify(buildPayload(formEditar)),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMensajeEdicion("✅ Libro actualizado correctamente.");
      cargarLibros(busqueda);
      setTimeout(() => setLibroEditando(null), 1500);
    } catch (error) {
      setMensajeEdicion(`❌ ${error.message}`);
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // ── ACTIVAR Y DESACTIVAR LIBRO ─────
  const handleCambiarEstado = async (libro) => {
    const nuevoEstado = !libro.activo;

    const mensaje = nuevoEstado
      ? `¿Activar "${libro.titulo}"?`
      : `¿Desactivar "${libro.titulo}"? No aparecerá en la tienda.`;

    if (!confirm(mensaje)) return;

    try {
      const res = await authFetch(
        `${BASE_URL}/libros/${libro.id_libro}/estado`,
        {
          method: "PUT",
          body: JSON.stringify({ activo: nuevoEstado }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      cargarLibros(busqueda);
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  // ── AGREGAR POR ISBN ─────────────────────────────────────
  const handleBuscarIsbn = async () => {
    if (!isbn.trim()) return;
    setBuscandoIsbn(true);
    setErrorIsbn("");
    setLibroBuscado(null);
    try {
      const res = await authFetch(
        `${BASE_URL}/libros/buscar-isbn/${isbn.trim()}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLibroBuscado(data);
      const libro = data.data;

      setFormIsbn({
        titulo: libro.titulo || libro.title || "",
        descripcion: libro.descripcion || libro.description || "",
        imagen: libro.imagen || libro.image || "",
        precio: "",
        stock: "",
        descuento: 0,
        autores: Array.isArray(libro.autores || libro.authors)
          ? (libro.autores || libro.authors).join(", ")
          : libro.autores || "",
        generos: Array.isArray(libro.generos || libro.categories)
          ? libro.generos || libro.categories
          : [],
        editorial: libro.editorial || libro.publisher || "",
        fecha_publicacion:
          libro.fecha_publicacion || libro.publishedDate
            ? String(libro.fecha_publicacion || libro.publishedDate).split(
                "T",
              )[0]
            : "",
        numero_paginas: libro.numero_paginas || libro.pageCount || "",
        formato: "fisico",
      });
    } catch (error) {
      setErrorIsbn(`❌ ${error.message}`);
    } finally {
      setBuscandoIsbn(false);
    }
  };

  const handleGuardarIsbn = async () => {
    if (!libroBuscado) return;
    setGuardandoIsbn(true);
    try {
      const res = await authFetch(`${BASE_URL}/libros`, {
        method: "POST",
        body: JSON.stringify({
          ...buildPayload(formIsbn),
          isbn: isbn.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      cerrarModalAgregar();
      cargarLibros(busqueda);
      alert("✅ Libro agregado correctamente.");
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setGuardandoIsbn(false);
    }
  };

  // ── AGREGAR MANUAL ───────────────────────────────────────
  const handleGuardarManual = async () => {
    if (!formManual.titulo || !formManual.precio) {
      setMensajeManual("❌ Título y precio son obligatorios.");
      return;
    }
    setGuardandoManual(true);
    setMensajeManual("");
    try {
      const res = await authFetch(`${BASE_URL}/libros`, {
        method: "POST",
        body: JSON.stringify({
          ...buildPayload(formManual),
          isbn: `MANUAL-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      cerrarModalAgregar();
      cargarLibros(busqueda);
      alert("✅ Libro agregado correctamente.");
    } catch (error) {
      setMensajeManual(`❌ ${error.message}`);
    } finally {
      setGuardandoManual(false);
    }
  };

  const cerrarModalAgregar = () => {
    setMostrarModalAgregar(false);
    setIsbn("");
    setLibroBuscado(null);
    setErrorIsbn("");
    setFormManual({ ...FORM_LIBRO_VACIO });
    setMensajeManual("");
    setTabAgregar("isbn");
  };

  // ── CAMPOS COMPARTIDOS ───────────────────────────────────
  const renderCamposLibro = (form, setForm) => (
    <div className="row g-3">
      <div className="col-12">
        <label className="form-label">Título *</label>
        <input
          type="text"
          className="form-control form-input"
          value={form.titulo}
          onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
        />
      </div>

      <div className="col-12">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control form-long-text"
          rows={3}
          value={form.descripcion}
          onChange={(e) =>
            setForm((p) => ({ ...p, descripcion: e.target.value }))
          }
        />
      </div>

      <div className="col-12">
        <label className="form-label">URL de imagen</label>
        <input
          type="text"
          className="form-control form-input"
          placeholder="https://..."
          value={form.imagen}
          onChange={(e) => setForm((p) => ({ ...p, imagen: e.target.value }))}
        />
        {form.imagen && (
          <img
            src={form.imagen}
            alt="preview"
            style={{ width: "60px", marginTop: "8px", borderRadius: "6px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>

      <div className="col-12">
        <label className="form-label">
          Autores{" "}
          <span className="text-secondary fw-light">(separados por coma)</span>
        </label>
        <input
          type="text"
          className="form-control form-input"
          placeholder="Ej: Gabriel García Márquez, Isabel Allende"
          value={form.autores}
          onChange={(e) => setForm((p) => ({ ...p, autores: e.target.value }))}
        />
      </div>

      <div className="col-12">
        <label className="form-label">Géneros</label>
        <div className="d-flex flex-wrap gap-2">
          {generos.map((g) => (
            <button
              key={g.id_genero}
              type="button"
              className={`btn btn-sm ${form.generos.includes(g.nombre) ? "boton-primario" : "boton-secundario"}`}
              onClick={() => toggleGenero(setForm, form.generos, g.nombre)}
            >
              {g.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="col-12">
        <label className="form-label">Editorial</label>
        <input
          type="text"
          className="form-control form-input"
          value={form.editorial}
          onChange={(e) =>
            setForm((p) => ({ ...p, editorial: e.target.value }))
          }
        />
      </div>

      <div className="col-12 col-sm-6">
        <label className="form-label">Fecha de publicación</label>
        <input
          type="date"
          className="form-control form-input"
          value={form.fecha_publicacion}
          onChange={(e) =>
            setForm((p) => ({ ...p, fecha_publicacion: e.target.value }))
          }
        />
      </div>

      <div className="col-12 col-sm-6">
        <label className="form-label">Número de páginas</label>
        <input
          type="number"
          className="form-control form-input"
          value={form.numero_paginas}
          onChange={(e) =>
            setForm((p) => ({ ...p, numero_paginas: e.target.value }))
          }
        />
      </div>

      <div className="col-12 col-sm-6">
        <label className="form-label">Formato</label>
        <select
          className="form-select"
          value={form.formato}
          onChange={(e) => setForm((p) => ({ ...p, formato: e.target.value }))}
        >
          <option value="fisico">Físico</option>
          <option value="digital">Digital</option>
          <option value="preventa">Preventa</option>
        </select>
      </div>

      <div className="col-12">
        <label className="form-label">Precio (CLP) *</label>
        <input
          type="number"
          className="form-control form-input"
          value={form.precio}
          onChange={(e) => setForm((p) => ({ ...p, precio: e.target.value }))}
        />
      </div>

      <div className="col-6">
        <label className="form-label">Stock *</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          readOnly
          className="form-control form-input"
        />
        ℹ️ El stock se administra desde Catálogo → Stock.
      </div>

      <div className="col-6">
        <label className="form-label">Descuento (%)</label>
        <input
          type="number"
          className="form-control form-input"
          min="0"
          max="100"
          value={form.descuento}
          onChange={(e) => {
            const valor = e.target.value;
            setForm((p) => ({
              ...p,
              descuento:
                p.descuento === 0 || p.descuento === "0"
                  ? valor.replace(/^0+/, "")
                  : valor,
            }));
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-md-3">
          <ProfileNavComponent />
        </div>

        <div className="col-12 col-md-9">
          <div className="profile-content">
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center mb-4">
              <h4 className="fw-semibold mb-0">Catálogo</h4>
              <div className="d-flex gap-2 w-100">
                <form
                  className="d-flex search-group flex-grow-1"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className="form-control nav-searchbar"
                    type="search"
                    placeholder="Buscar libro"
                    value={busqueda}
                    onChange={handleBusqueda}
                  />
                  <button
                    className="btn boton-primario boton-search-navbar"
                    type="submit"
                  >
                    <i className="fa-regular fa-magnifying-glass"></i>
                  </button>
                </form>
                <div className="d-flex gap-2">
                  <button
                    className="btn boton-primario"
                    onClick={() => setMostrarModalAgregar(true)}
                  >
                    <span className="d-none d-lg-inline">Agregar item</span>{" "}
                    <i className="fa-regular fa-plus"></i>
                  </button>

                  <button
                    className="btn boton-primario"
                    onClick={() => navigate("/movimiento-stock")}
                  >
                    <span className="d-none d-lg-inline">Stock</span>{" "}
                    <i className="fa-regular fa-boxes-stacked"></i>
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : libros.length === 0 ? (
              <p className="text-secondary text-center py-4">
                No se encontraron libros.
              </p>
            ) : (
              librosPaginados.map((libro) => (
                <React.Fragment key={libro.id_libro}>
                  <hr className="divider" />
                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between item-libro">
                    <div className="d-flex gap-3 align-items-start">
                      {libro.imagen && (
                        <img
                          className="img-fluid"
                          src={libro.imagen}
                          alt={libro.titulo}
                        />
                      )}
                      <div className="book-info">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="fw-semibold mb-0">{libro.titulo}</h5>
                          {libro.formato?.toLowerCase() === "preventa" && (
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "#4A5947",
                                fontSize: "10px",
                              }}
                            >
                              PREVENTA
                            </span>
                          )}
                        </div>
                        {libro.autores && (
                          <p className="mb-0">
                            Autor:{" "}
                            <span className="fw-semibold">{libro.autores}</span>
                          </p>
                        )}
                        <p className="mb-0">
                          Editorial:{" "}
                          <span className="fw-semibold">{libro.editorial}</span>
                        </p>
                        <p className="mb-0">
                          Stock:{" "}
                          <span className="fw-semibold">
                            {libro.stock ?? "—"}
                          </span>
                        </p>
                        {libro.descuento > 0 && (
                          <p className="mb-0">
                            Descuento:{" "}
                            <span className="fw-semibold">
                              {libro.descuento}%
                            </span>
                          </p>
                        )}
                        <p className="fw-semibold card-price mb-0">
                          $
                          {Number(
                            libro.precio_final ?? libro.precio,
                          ).toLocaleString("es-CL")}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-row flex-sm-column justify-content-between justify-content-sm-start gap-2">
                      <button
                        className="link-editar btn btn-sm"
                        onClick={() => abrirModalEditar(libro)}
                      >
                        <i className="fa-regular fa-pen-to-square"></i> Editar
                      </button>
                      <button
                        className={`btn btn-sm ${
                          libro.activo ? "link-eliminar" : "btn-success"
                        }`}
                        onClick={() => handleCambiarEstado(libro)}
                      >
                        <i
                          className={`fa-solid ${
                            libro.activo ? "fa-trash-can" : "fa-rotate-left"
                          }`}
                        ></i>{" "}
                        {libro.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}

            {totalPaginas > 1 && (
              <>
                <hr className="divider" />
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    {[...Array(totalPaginas)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL EDITAR ─────────────────────────────────── */}
      {libroEditando && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="profile-content pb-4"
            style={{
              width: "100%",
              maxWidth: "560px",
              margin: "1rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold mb-0">Editar libro</h5>
              <button
                className="btn btn-sm"
                onClick={() => setLibroEditando(null)}
              >
                ✕
              </button>
            </div>
            <hr className="divider mb-3" />
            {renderCamposLibro(formEditar, setFormEditar)}
            {mensajeEdicion && <p className="mt-3 mb-0">{mensajeEdicion}</p>}
            <div className="d-flex gap-2 mt-4">
              <button
                className="btn boton-primario"
                onClick={handleGuardarEdicion}
                disabled={guardandoEdicion}
              >
                {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                className="btn boton-secundario"
                onClick={() => setLibroEditando(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AGREGAR ────────────────────────────────── */}
      {mostrarModalAgregar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="profile-content pb-4"
            style={{
              width: "100%",
              maxWidth: "580px",
              margin: "1rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold mb-0">Agregar libro</h5>
              <button className="btn btn-sm" onClick={cerrarModalAgregar}>
                ✕
              </button>
            </div>

            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${tabAgregar === "isbn" ? "active" : ""}`}
                  onClick={() => setTabAgregar("isbn")}
                >
                  Por ISBN
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tabAgregar === "manual" ? "active" : ""}`}
                  onClick={() => setTabAgregar("manual")}
                >
                  Manual
                </button>
              </li>
            </ul>

            {/* TAB ISBN con spinner en búsqueda y en agregar */}
            {tabAgregar === "isbn" && (
              <>
                <div className="d-flex gap-2 mb-3">
                  <input
                    type="text"
                    className="form-control form-input"
                    placeholder="Ej: 9788466379717"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBuscarIsbn()}
                    disabled={buscandoIsbn}
                  />
                  <button
                    className="btn boton-primario"
                    onClick={handleBuscarIsbn}
                    disabled={buscandoIsbn}
                    style={{ minWidth: "100px" }}
                  >
                    {buscandoIsbn ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Buscando...
                      </>
                    ) : (
                      "Buscar"
                    )}
                  </button>
                </div>

                {errorIsbn && <p className="text-danger mb-3">{errorIsbn}</p>}

                {buscandoIsbn && !libroBuscado && !errorIsbn && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">
                        Cargando información del libro...
                      </span>
                    </div>
                    <p className="text-secondary mt-2">
                      Consultando fuentes externas...
                    </p>
                  </div>
                )}

                {libroBuscado && (
                  <>
                    <div
                      className="d-flex gap-3 mb-3 p-3"
                      style={{
                        backgroundColor: "#F1F2ED",
                        borderRadius: "12px",
                      }}
                    >
                      {formIsbn.imagen && (
                        <img
                          src={formIsbn.imagen}
                          alt={formIsbn.titulo || "Libro encontrado"}
                          style={{
                            width: "60px",
                            borderRadius: "6px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div>
                        <p className="fw-semibold mb-0">
                          {formIsbn.titulo || "Sin título"}
                        </p>
                        {formIsbn.autores && (
                          <p className="text-secondary mb-1">
                            {formIsbn.autores}
                          </p>
                        )}
                        <span
                          className="badge"
                          style={{ backgroundColor: "#6B705C" }}
                        >
                          Fuente: {libroBuscado.origen}
                        </span>
                      </div>
                    </div>

                    {renderCamposLibro(formIsbn, setFormIsbn)}

                    <div className="d-flex gap-2 mt-4">
                      <button
                        className="btn boton-primario"
                        onClick={handleGuardarIsbn}
                        disabled={
                          guardandoIsbn || !formIsbn.titulo || !formIsbn.precio
                        }
                        style={{
                          opacity: guardandoIsbn ? 0.8 : 1,
                          backgroundColor: "#4a5947",
                          color: "white",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {guardandoIsbn ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Agregando...
                          </>
                        ) : (
                          "Agregar al catálogo"
                        )}
                      </button>
                      <button
                        className="btn boton-secundario"
                        onClick={cerrarModalAgregar}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* TAB MANUAL con spinner en agregar */}
            {tabAgregar === "manual" && (
              <>
                {renderCamposLibro(formManual, setFormManual)}
                {mensajeManual && <p className="mt-3 mb-0">{mensajeManual}</p>}
                <div className="d-flex gap-2 mt-4">
                  <button
                    className="btn boton-primario"
                    onClick={handleGuardarManual}
                    disabled={guardandoManual}
                    style={{
                      opacity: guardandoManual ? 0.8 : 1,
                      backgroundColor: "#4a5947",
                      color: "white",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {guardandoManual ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Agregando...
                      </>
                    ) : (
                      "Agregar al catálogo"
                    )}
                  </button>
                  <button
                    className="btn boton-secundario"
                    onClick={cerrarModalAgregar}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
