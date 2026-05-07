const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔐 Middleware de autenticación
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No se proporcionó un token de autenticación"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token inválido"
    });
  }
};

// 🔐 Middleware de autorización (admin)
const verificarAdmin = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    if (user.rol !== "admin") {
      return res.status(403).json({
        message: "No tienes permisos para acceder a esta ruta"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error en verificación de permisos"
    });
  }
};

module.exports = { authMiddleware, verificarAdmin };