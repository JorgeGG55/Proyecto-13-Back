const express = require("express");
const authRoutes = express.Router();
const { register, login } = require("../controllers/auth");

authRoutes.post("/register", register);
authRoutes.post("/login", login);

module.exports = authRoutes;
