import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { ProfileNavComponent } from "../components/ProfileNav";

export const Favoritos = ({ user }) => {
  const { favoritos, totalFavoritos } = useFavorites();
  const { agregarAlCarrito } = useCart();

  const handleAgregarTodos = () => {
    favoritos.forEach(libro => agregarAlCarrito(libro))
  }

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* SIDEBAR */}
        <div className="col-12 col-md-3">
          <ProfileNavComponent user={user} />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="col-12 col-md-9">
          <div className="profile-content pb-4">

            <div className="encabezado">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-semibold mb-0">Mis Favoritos ❤️</h4>
                {totalFavoritos > 0 && (
                  <button
                    className="btn boton-primario"
                    onClick={handleAgregarTodos}
                  >
                    <i className="fa-solid fa-basket-shopping"></i> Agregar todos al carrito
                  </button>
                )}

              </div>

            </div>

            


            {totalFavoritos === 0 ? (
              <div className="text-center py-5">
                <i className="fa-regular fa-heart fa-3x mb-3" style={{ color: '#6B705C' }}></i>
                <h5 className="fw-semibold">No tienes libros favoritos aún</h5>
                <p className="text-secondary">Explora nuestro catálogo y marca los libros que te gusten con el corazón.</p>
                <Link to="/libros" className="btn boton-primario mt-2">
                  Ver libros
                </Link>
              </div>
            ) : (

              <>
                <hr className="divider mb-3"/>
                <div className="row g-4 favoritos-grid">
                  {favoritos.map((libro) => (
                    <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-3">
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
              </>
              
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Favoritos;