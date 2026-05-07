import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext"; //

function ProductCard({
  id_libro,
  imagen,
  titulo,
  autor,
  precio,
  descuento = false,
  precio_original = null,
}) {
  const { agregarAlCarrito } = useCart();
  const { esFavorito, toggleFavorito } = useFavorites();
  const { isAuthenticated } = useUser(); //
  const navigate = useNavigate(); //
  const handleAgregar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 👈 VERIFICAR SI ESTÁ LOGUEADO
    if (!isAuthenticated) {
      navigate("/registro");
      return;
    }
    agregarAlCarrito({
      id_libro,
      imagen,
      titulo,
      autor,
      precio,
    });
  };

  const handleToggleFavorito = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 👈 VERIFICAR SI ESTÁ LOGUEADO
    if (!isAuthenticated) {
      navigate("/registro");
      return;
    }

    const libro = { id_libro, imagen, titulo, autor, precio };
    toggleFavorito(libro);
  };

  return (
    <div className="product-card-wrapper position-relative">
      <button
        onClick={handleToggleFavorito}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          zIndex: 10,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className={`fa-heart ${esFavorito(id_libro) ? "fa-solid" : "fa-regular"}`}
          style={{
            color: esFavorito(id_libro) ? "#dc3545" : "#888",
            fontSize: "18px",
          }}
        ></i>
      </button>

      <Link to={`/libro/${id_libro}`} className="product-card-link">
        <div key={id_libro} className="product-card">
          <img
            src={imagen}
            alt={titulo}
            className="card-image img-fluid mb-2"
          />
          <div className="card-body">
            <p className="autor-name-card">{autor}</p>
            <h5 className="card-title">{titulo}</h5>

            {descuento ? (
              <div className="d-flex align-items-center gap-2 mb-3">
                <p className="precio-original mb-0">
                  ${Number(precio_original).toLocaleString("es-CL")}
                </p>

                <p className="card-price fw-semibold fs-5 mb-0">
                  ${Number(precio).toLocaleString("es-CL")}
                </p>
              </div>
            ) : (
              <p className="card-price fw-semibold fs-5">
                ${Number(precio).toLocaleString("es-CL")}
              </p>
            )}
          </div>
          <button
            className="btn boton-agregar boton-primario"
            onClick={handleAgregar}
          >
            Agregar <i className="fa-solid fa-basket-shopping"></i>
          </button>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
