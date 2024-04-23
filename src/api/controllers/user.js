const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserFromToken = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(
      token,
      "4c5f07bdab1d6b2f2632bcd6506a38cadc0bcd81c4e2911a59062e008b6b71a2"
    );
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserFromToken,
};
