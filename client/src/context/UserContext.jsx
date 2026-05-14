import React, { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión desde localStorage al iniciar la app
  useEffect(() => {
    const userGuardado = localStorage.getItem("user");
    if (userGuardado) {
      try {
        setUser(JSON.parse(userGuardado));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // LOGIN — POST /clientes/login
  // Retorna: { cliente: { id_cliente, nombre, email, rol }, token }
  const login = async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/clientes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, mensaje: data.message || "Credenciales incorrectas." };
      }

      // Normalizar: el backend usa "rol", el frontend usaba "role"
      // Guardamos "rol" para ser consistentes con el backend
      const userLogueado = {
        id_cliente: data.cliente.id_cliente,
        nombre: data.cliente.nombre,
        email: data.cliente.email,
        rol: data.cliente.rol,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userLogueado));
      setUser(userLogueado);

      window.dispatchEvent(new Event("login"));

      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: "Error de conexión con el servidor." };
    }
  };

  // REGISTRO — POST /clientes/register
  // El backend acepta: { nombre, email, password }
  const register = async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/clientes/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: userData.nombre,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, mensaje: data.message || "Error al registrarse." };
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: "Error de conexión con el servidor." };
    }
  };

  // ACTUALIZAR PERFIL
  // TODO: conectar a PUT /clientes/:id cuando el backend lo tenga
  const actualizarPerfil = async (datosActualizados) => {
    try {
      const res = await fetch(`${BASE_URL}/clientes/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(datosActualizados),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        return { ok: false, mensaje: data.message || "Error al actualizar perfil." };
      }
  
      const userActualizado = { ...user, ...data.data };
      setUser(userActualizado);
      localStorage.setItem("user", JSON.stringify(userActualizado));
  
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: "Error de conexión con el servidor." };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        actualizarPerfil,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};