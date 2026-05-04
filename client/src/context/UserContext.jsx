import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const userGuardado = localStorage.getItem("user");
    if (userGuardado) {
      try {
        setUser(JSON.parse(userGuardado));
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Iniciar sesión (simulado por ahora)
  const login = (email, password) => {
    // Simulación: cualquier email/contraseña funciona
    // Después se conectará con el backend de Orlando
    const usuarioSimulado = {
      id: Date.now(), // ID temporal
      email: email,
      nombre: email.split("@")[0], // Nombre basado en el email
      apellido: "",
      role: "user",
    };

    setUser(usuarioSimulado);
    localStorage.setItem("user", JSON.stringify(usuarioSimulado));
    return true;
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Registrar usuario (simulado)
  const register = (userData) => {
    const nuevoUsuario = {
      id: Date.now(),
      ...userData,
      role: "user",
    };

    // No iniciamos sesión automáticamente, solo creamos el usuario
    // Después se conectará con el backend
    console.log("Usuario registrado:", nuevoUsuario);
    return true;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user, // true si hay usuario, false si no
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
