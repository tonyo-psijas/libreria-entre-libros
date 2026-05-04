import React, { createContext, useContext, useState, useEffect } from "react";
import { clientesMock } from "../mock_data/mockData";

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

  // Base de usuarios simulada — incluye los del mock más una cuenta admin
  // Cuando el backend esté listo, esto se reemplaza por llamadas a la API
  const [usuarios, setUsuarios] = useState([
    ...clientesMock.data,
    {
      id_cliente: 999,
      nombre: "Admin",
      apellido: "Entre Libros",
      email: "admin@entrelibros.cl",
      telefono: "",
      password: "admin1234",
      role: "admin",
    },
  ])

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

  // LOGIN — busca el usuario en la lista simulada
  // TODO: reemplazar por POST /auth/login
  const login = (email, password) => {
    const encontrado = usuarios.find(
      (u) => u.email === email && u.password === password
    );

    if (!encontrado) {
      return { ok: false, mensaje: "Email o contraseña incorrectos." }
    }

    const userLogueado = {
      id_cliente: encontrado.id_cliente,
      nombre: encontrado.nombre,
      apellido: encontrado.apellido,
      email: encontrado.email,
      telefono: encontrado.telefono || "",
      role: encontrado.role || "cliente",
    };

    setUser(userLogueado);
    localStorage.setItem("user", JSON.stringify(userLogueado));
    return { ok: true }
  };

  // REGISTRO — agrega un nuevo usuario a la lista simulada
  // TODO: reemplazar por POST /auth/register
  const register = (userData) => {
    const emailExiste = usuarios.some((u) => u.email === userData.email);
    if (emailExiste) {
      return { ok: false, mensaje: "Ya existe una cuenta con ese email." }
    }

    const nuevoUsuario = {
      id_cliente: Date.now(),
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      telefono: userData.telefono || "",
      password: userData.password,
      role: "cliente",
    };

    setUsuarios(prev => [...prev, nuevoUsuario])
    return { ok: true }
  };

  // ACTUALIZAR PERFIL — modifica los datos del usuario logueado
  // TODO: reemplazar por PUT /clientes/:id
  const actualizarPerfil = (datosActualizados) => {
    const userActualizado = { ...user, ...datosActualizados }
    setUser(userActualizado)
    localStorage.setItem("user", JSON.stringify(userActualizado))

    // También actualizar en la lista de usuarios
    setUsuarios(prev =>
      prev.map(u =>
        u.id_cliente === user.id_cliente
          ? { ...u, ...datosActualizados }
          : u
      )
    )
    return { ok: true }
  }

  // CERRAR SESIÓN
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    actualizarPerfil,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};