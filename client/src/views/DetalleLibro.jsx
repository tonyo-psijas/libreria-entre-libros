import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const DetalleLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const { esFavorito, toggleFavorito } = useFavorites();
  const { isAuthenticated } = useUser();

  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [sinopsisAbierta, setSinopsisAbierta] = useState(true);

  useEffect(() => {
    const cargarLibro = async () => {
      setLoading(true)
      try {
        // GET /libros/:id retorna: { id_libro, titulo, descripcion, precio,
        // descuento, precio_final, formato, stock, imagen, autores, generos }
        const res = await fetch(`${BASE_URL}/libros/${id}`)
        if (!res.ok) throw new Error("Libro no encontrado")
        const data = await res.json()
        setLibro(data)
      } catch (err) {
        console.error("Error al cargar libro:", err)
        setError("No se pudo cargar el libro.")
      } finally {
        setLoading(false)
      }
    }
    cargarLibro()
  }, [id]);

  const handleAgregarAlCarrito = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (libro) {
      agregarAlCarrito({
        id_libro: libro.id_libro,
        imagen: libro.imagen,
        titulo: libro.titulo,
        autor: libro.autores || '',
        precio: libro.precio_final ?? libro.precio,
        cantidad,
      });
    }
  };

  const handleToggleFavorito = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (libro) {
      toggleFavorito({
        id_libro: libro.id_libro,
        imagen: libro.imagen,
        titulo: libro.titulo,
        autor: libro.autores || '',
        precio: libro.precio_final ?? libro.precio,
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !libro) {
    return (
      <div className="container py-5 text-center">
        <h5>{error || "Libro no encontrado."}</h5>
      </div>
    );
  }

  const precioFinal = libro.precio_final ?? libro.precio
  const tieneDescuento = libro.descuento && libro.descuento > 0

  return (
    <div className="container mt-5">
      <div className="book-detail-content">
        <div className="row">
          <div className="col-12 col-md-4 col-lg-3 mb-3">
            <img
              src={libro.imagen}
              alt={libro.titulo}
              className="img-fluid rounded shadow-sm w-100"
            />
          </div>

          <div className="col-12 col-md-8 col-lg-9">
            <h1 className="fw-bold mb-3">{libro.titulo}</h1>

            {libro.autores && (
              <p className="text-muted mb-2">
                <strong>Autor:</strong> {libro.autores}
              </p>
            )}

            {libro.generos && (
              <p className="text-muted mb-2">
                <strong>Categorías:</strong> {libro.generos}
              </p>
            )}

            <hr className="divider" />

            {tieneDescuento ? (
              <div className="mt-2 d-flex align-items-center">
                <span className="text-decoration-line-through text-muted fs-5 me-2">
                  ${Number(libro.precio).toLocaleString("es-CL")}
                </span>
                <span className="fw-bold fs-2 text-danger">
                  ${Number(precioFinal).toLocaleString("es-CL")}
                </span>
                <span className="badge ms-2" style={{ backgroundColor: '#FCB400' }}>
                  -{libro.descuento}%
                </span>
              </div>
            ) : (
              <div className="mb-3 mt-2">
                <span className="fw-bold fs-2">
                  ${Number(precioFinal).toLocaleString("es-CL")}
                </span>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="cantidad" className="form-label fw-semibold">
                Cantidad:
              </label>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <input
                  type="number"
                  id="cantidad"
                  className="form-control form-input"
                  style={{ width: "100px" }}
                  min="1"
                  max={libro.stock || 99}
                  value={cantidad}
                  onChange={(e) =>
                    setCantidad(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button
                  className="btn boton-primario px-4 py-2 fw-semibold"
                  onClick={handleAgregarAlCarrito}
                >
                  Agregar al carrito{" "}
                  <i className="fa-solid fa-basket-shopping"></i>
                </button>

                <button
                  onClick={handleToggleFavorito}
                  className="btn px-3 py-2"
                  style={{ fontSize: "1.2rem" }}
                  title={esFavorito(libro.id_libro) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <i
                    className={`fa-heart ${esFavorito(libro.id_libro) ? "fa-solid" : "fa-regular"}`}
                    style={{ color: esFavorito(libro.id_libro) ? "#dc3545" : "#888" }}
                  ></i>
                </button>
              </div>
            </div>

            <div className="mb-2">
              <hr className="divider" />

              <div className="sinopsis mt-3 mb-3">
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSinopsisAbierta(!sinopsisAbierta)}
                >
                  <h5 className="fw-semibold mb-0">Sinopsis</h5>
                  <i className={`fa-regular ${sinopsisAbierta ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                </div>
                {sinopsisAbierta && (
                  <p className="text-secondary mt-3">{libro.descripcion}</p>
                )}
              </div>

              <hr className="divider" />

              <p className="text-success mb-1 mt-3">
                <strong>Stock:</strong> {libro.stock || "Consultar"} unidades disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleLibro;