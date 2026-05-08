import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { CartProvider } from "./context/CartContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/entre-libros">
      <UserProvider>
        <OrderProvider>
          <CartProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </CartProvider>
        </OrderProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
