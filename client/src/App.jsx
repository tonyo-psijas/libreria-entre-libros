import "./App.css";

import { UserManagement } from "./views/UserManagement";
import { NavbarComponent } from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./views/Home";
import { Profile } from "./views/Profile";
import { Catalogo } from "./views/Catalogo";
import { Carrito } from "./views/Carrito";
import { Favoritos } from "./views/Favoritos";
import { Gallery } from "./views/Gallery";
import { Promociones } from "./views/Promociones";
import { ComicsMangas } from "./views/ComicsMangas";
import { Preventas } from "./views/Preventas";
import { FooterComponent } from "./components/FooterComponent";

import { Checkout } from "./views/Checkout";
import { DetallePedido } from "./views/DetallePedido";
import { HistorialCompras } from "./views/HistorialCompras";
import { HistorialVentas } from "./views/HistorialVentas";
import { HistorialAdmin } from "./views/HistorialAdmin";

import Login from "./views/Login";
import Registro from "./views/Registro";
import DetalleLibro from "./views/DetalleLibro";

import { useFavorites } from "./context/FavoritesContext";
import { useCart } from "./context/CartContext";
import ToastFavorito from "./components/ToastFavorito";
import ToastCarrito from "./components/ToastCarrito";

import { useUser } from "./context/UserContext";
import { Contacto } from "./views/Contacto";

function App() {
  const { user, isAuthenticated, loading } = useUser();

  const favoritosContext = useFavorites();
  const cartContext = useCart();

  const mensajeFavorito = favoritosContext.mensaje;
  const setMensajeFavorito = favoritosContext.setMensaje;
  const mensajeCarrito = cartContext.mensaje;
  const setMensajeCarrito = cartContext.setMensaje;

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <NavbarComponent />

      <main>
        <Routes>
          {/* 🟢 RUTAS PÚBLICAS (no requieren login) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/libro/:id" element={<DetalleLibro />} />
          <Route path="/libros" element={<Gallery />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/comics-&-mangas" element={<ComicsMangas />} />
          <Route path="/preventas" element={<Preventas />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* 🟡 RUTAS PROTEGIDAS (requieren login) */}
          <Route
            path="/favoritos"
            element={isAuthenticated ? <Favoritos /> : <Navigate to="/login" />}
          />

          <Route
            path="/checkout"
            element={isAuthenticated ? <Checkout /> : <Navigate to="/login" />}
          />

          <Route
            path="/pedido/:id_pedido"
            element={
              isAuthenticated ? <DetallePedido /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/historial-compras"
            element={
              isAuthenticated ? <HistorialCompras /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/perfil"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path="/carrito"
            element={isAuthenticated ? <Carrito /> : <Navigate to="/login" />}
          />

          {/* 🔵 RUTA ADMIN (solo para administradores) */}
          <Route
            path="/catalogo"
            element={
              isAuthenticated && user?.rol === "admin" ? (
                <Catalogo user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/historial-ventas"
            element={
              isAuthenticated && user?.rol === "admin" ? (
                <HistorialVentas />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/gestion-de-usuarios"
            element={
              isAuthenticated && user?.rol === "admin" ? (
                <UserManagement />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/historial-admin"
            element={
              isAuthenticated && user?.rol === "admin" ? (
                <HistorialAdmin />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>

      <FooterComponent />

      <ToastFavorito
        mensaje={mensajeFavorito}
        onClose={() => setMensajeFavorito("")}
      />

      <ToastCarrito
        mensaje={mensajeCarrito}
        onClose={() => setMensajeCarrito("")}
      />
    </div>
  );
}

export default App;
