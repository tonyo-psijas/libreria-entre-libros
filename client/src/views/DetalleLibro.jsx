import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { librosMock } from "../mock_data/mockData";
import { useCart } from "../context/CartContext";

export const DetalleLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const [libro, setLibro] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const libroEncontrado = librosMock.result.find(
      (l) => l.id_libro === parseInt(id),
    );
    if (libroEncontrado) {
      setLibro(libroEncontrado);
    }
  }, [id]);

  const handleAgregarAlCarrito = () => {
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
      alert(`✅ ${libro.titulo} (x${cantidad}) se agregó al carrito`);
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
    libro.categorias?.map((cat) => cat.nombre).join(", ") || "General";

  return (
    <div className="container py-5">
      <div className="row">
        <div className="ccol-12 col-md-3 col-lg-2 mb-4">
          <img
            src={libro.imagen}
            alt={libro.titulo}
            className="img-fluid rounded shadow-sm w-100"
          />
        </div>

        <div className="col-12 col-md-7 col-lg-8">
          <h1 className="fw-bold mb-3">{libro.titulo}</h1>

          <p className="text-muted mb-2">
            <strong>Autor:</strong> {autores}
          </p>

          <p className="text-muted mb-2">
            <strong>Categorías:</strong> {categorias}
          </p>

          {libro.sku && (
            <p className="text-muted mb-3">
              <strong>SKU:</strong> {libro.sku}
            </p>
          )}

          {libro.descuento ? (
            <div className="mb-3">
              <span className="text-decoration-line-through text-muted fs-5 me-2">
                ${Number(libro.precio_original).toLocaleString("es-CL")}
              </span>
              <span className="fw-bold fs-2 text-danger">
                ${Number(libro.precio).toLocaleString("es-CL")}
              </span>
            </div>
          ) : (
            <div className="mb-3">
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
                className="form-control"
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
            </div>
          </div>

          <div className="mb-2">
            <p className="text-success mb-1">
              <strong>Stock:</strong> {libro.stock || "Consultar"} unidades
              disponibles
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleLibro;
