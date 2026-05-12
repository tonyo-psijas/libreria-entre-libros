const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No se proporcionó un token de autenticación",
      });
    }

    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Formato de token inválido.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
};

// Middleware de autorización admin
const verificarAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Usuario no autenticado",
    });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({
      message: "Acceso denegado. Se requiere rol administrador",
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  verificarAdmin,
};