const express = require("express");
const booksRoutes = express.Router();
const booksController = require("../controllers/books");
const createStorage = require("../../middlewares/fileUpload");
const uploadBooks = createStorage("books");
const authenticateToken = require("../../middlewares/auth");

//ruta con usuario
booksRoutes.post(
  "/",
  authenticateToken,
  uploadBooks.fields([{ name: "bookImg" }]),
  booksController.createBook
);
booksRoutes.put("/:id", authenticateToken, booksController.updateBook);
booksRoutes.delete("/:id", authenticateToken, booksController.deleteBook);

//ruta sin usuario
booksRoutes.get("/", booksController.getAllBooks);
booksRoutes.get("/:id", booksController.getBookById);

module.exports = booksRoutes;
