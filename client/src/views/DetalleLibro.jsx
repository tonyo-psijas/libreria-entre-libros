import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { librosMock } from "../mock_data/mockData";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";
export const DetalleLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const { esFavorito, toggleFavorito } = useFavorites();
  const { isAuthenticated } = useUser();
  const [libro, setLibro] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [sinopsisAbierta, setSinopsisAbierta] = useState(true);

  useEffect(() => {
    const libroEncontrado = librosMock.result.find(
      (l) => l.id_libro === parseInt(id),
    );
    if (libroEncontrado) {
      setLibro(libroEncontrado);
    }
  }, [id]);

  const handleAgregarAlCarrito = () => {
    // 👈 VERIFICAR SI ESTÁ LOGUEADO
    if (!isAuthenticated) {
      navigate("/registro");
      return;
    }

    if (libro) {
      for (let i = 0; i < cantidad; i++) {
        agregarAlCarrito({
          id_libro: libro.id_libro,
          imagen: libro.imagen,
          titulo: libro.titulo,
          autor: libro.autores.map((autor) => autor.nombre).join(", "),
          precio: libro.precio,
        });
      }
    }
  };

  const handleToggleFavorito = () => {
    // 👈 VERIFICAR SI ESTÁ LOGUEADO
    if (!isAuthenticated) {
      navigate("/registro");
      return;
    }

    if (libro) {
      const libroFavorito = {
        id_libro: libro.id_libro,
        imagen: libro.imagen,
        titulo: libro.titulo,
        autor: libro.autores.map((autor) => autor.nombre).join(", "),
        precio: libro.precio,
      };
      toggleFavorito(libroFavorito);
    }
  };

  if (!libro) {
    return (
      <div className="container py-5 text-center">
        <h2>Cargando...</h2>
      </div>
    );
  }

  const autores = libro.autores.map((autor) => autor.nombre).join(", ");
  const categorias =
    libro.generos?.map((cat) => cat.nombre).join(", ") || "General";

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

            <p className="text-muted mb-2">
              <strong>Autor:</strong> {autores}
            </p>

            <p className="text-muted mb-2">
              <strong>Categorías:</strong> {categorias}
            </p>

            <hr className="divider" />

            {libro.sku && (
              <p className="text-muted mb-3">
                <strong>SKU:</strong> {libro.sku}
              </p>
            )}

            {libro.descuento ? (
              <div className="mt-2">
                <span className="text-decoration-line-through text-muted fs-5 me-2">
                  ${Number(libro.precio_original).toLocaleString("es-CL")}
                </span>
                <span className="fw-bold fs-2 text-danger">
                  ${Number(libro.precio).toLocaleString("es-CL")}
                </span>
              </div>
            ) : (
              <div className="mb-3 mt-2">
                <span className="fw-bold fs-2">
                  ${Number(libro.precio).toLocaleString("es-CL")}
                </span>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="cantidad" className="form-label fw-semibold">
                Cantidad:
              </label>
              <div className="d-flex align-items-center gap-2">
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
                  title={
                    esFavorito(libro.id_libro)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"
                  }
                >
                  <i
                    className={`fa-heart ${esFavorito(libro.id_libro) ? "fa-solid" : "fa-regular"}`}
                    style={{
                      color: esFavorito(libro.id_libro) ? "#dc3545" : "#888",
                    }}
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
                  <i
                    className={`fa-regular ${sinopsisAbierta ? "fa-chevron-up" : "fa-chevron-down"}`}
                  ></i>
                </div>

                {sinopsisAbierta && (
                  <p className="text-secondary mt-3">{libro.descripcion}</p>
                )}
              </div>

              <hr className="divider" />

              <p className="text-success mb-1 mt-3">
                <strong>Stock:</strong> {libro.stock || "Consultar"} unidades
                disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleLibro;
