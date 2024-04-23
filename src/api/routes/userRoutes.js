const express = require("express");
const userRoutes = express.Router();
const userController = require("../controllers/user");
const authenticateToken = require("../../middlewares/auth");

userRoutes.get("/:id", userController.getUserById);
userRoutes.get("/", authenticateToken, userController.getUserFromToken);

module.exports = userRoutes;
