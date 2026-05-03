import "./App.css";

import { NavbarComponent } from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./views/Home";
import { Profile } from "./views/Profile";
import { Catalogo } from "./views/Catalogo";
import { Carrito } from "./views/Carrito";
import { Favoritos } from "./views/Favoritos";
import { Gallery } from "./views/Gallery";
import { FooterComponent } from "./components/FooterComponent";

import Login from "./views/Login";
import Registro from "./views/Registro";
import DetalleLibro from "./views/DetalleLibro";

import { useFavorites } from "./context/FavoritesContext";
import { useCart } from "./context/CartContext";
import ToastFavorito from "./components/ToastFavorito";
import ToastCarrito from "./components/ToastCarrito";

function App() {
  const user = {
    id: 1,
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@email.com",
    telefono: "+56 9 1234 5678",
    role: "admin",
  };

  // const user = null;

  const favoritosContext = useFavorites();
  const cartContext = useCart();

  const mensajeFavorito = favoritosContext.mensaje;
  const setMensajeFavorito = favoritosContext.setMensaje;
  const mensajeCarrito = cartContext.mensaje;
  const setMensajeCarrito = cartContext.setMensaje;

  return (
    <div className="app-layout">
      <NavbarComponent user={user} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/libro/:id" element={<DetalleLibro />} />
          <Route
            path="/favoritos"
            element={user ? <Favoritos user={user} /> : <Navigate to={"/login"} />}
          />

          <Route
            path="/perfil"
            element={
              user ? <Profile user={user} /> : <Navigate to={"/login"} />
            }
          />

          <Route
            path="/carrito"
            element={user ? <Carrito /> : <Navigate to={"/login"} />}
          />

          <Route
            path="/libros"
            element={user ? <Gallery /> : <Navigate to={"/login"} />}
          />

          <Route
            path="/catalogo"
            element={
              user && user.role === "admin" ? (
                <Catalogo user={user} />
              ) : (
                <Navigate to={"/login"} />
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
