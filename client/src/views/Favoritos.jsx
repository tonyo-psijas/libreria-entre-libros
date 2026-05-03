import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import ProductCard from "../components/ProductCard";

export const Favoritos = () => {
  const { favoritos, totalFavoritos } = useFavorites();

  if (totalFavoritos === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">❤️ Tus Favoritos</h2>
        <div className="card shadow-sm p-5">
          <i className="fa-regular fa-heart fs-1 mb-3 text-muted"></i>
          <h4>No tienes libros favoritos aún</h4>
          <p>
            Explora nuestro catálogo y marca los libros que te gusten con el
            corazón ❤️
          </p>
          <Link to="/libros" className="btn btn-primary mt-3">
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>❤️ Mis Libros Favoritos</h2>
        <span className="badge bg-primary fs-6" style={{ fontWeight: 400 }}>
          {totalFavoritos} libros
        </span>
      </div>

      <div className="row g-4">
        {favoritos.map((libro) => (
          <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-2">
            <ProductCard
              id_libro={libro.id_libro}
              imagen={libro.imagen}
              titulo={libro.titulo}
              autor={libro.autor}
              precio={libro.precio}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favoritos;
