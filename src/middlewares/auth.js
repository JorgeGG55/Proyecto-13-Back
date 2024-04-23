const jwt = require("jsonwebtoken");
const User = require("../api/models/user");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de autenticación no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Token de autenticación inválido" });
    } else {
      try {
        const user = await User.findById(decodedToken._id);
        if (!user) {
          return res
            .status(401)
            .json({ message: "Usuario no encontrado en la base de datos" });
        }
        req.user = user;
        next();
      } catch (error) {
        console.error("Error al buscar al usuario:", error);
        return res.status(500).json({ message: "Error en el servidor" });
      }
    }
  });
};

module.exports = authenticateToken;
