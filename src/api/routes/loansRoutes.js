const express = require("express");
const loansRoutes = express.Router();
const loanController = require("../controllers/loan");
const authenticateToken = require("../../middlewares/auth");

//rutas con usuario
loansRoutes.post("/:bookId", authenticateToken, loanController.createLoan);
loansRoutes.get("/user", authenticateToken, loanController.getAllLoansByUser);
loansRoutes.delete("/:id", authenticateToken, loanController.deleteLoan);

//rutas sin usuario
loansRoutes.get("/", loanController.getAllLoans);
loansRoutes.get("/:id", loanController.getLoanById);

module.exports = loansRoutes;
