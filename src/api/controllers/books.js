const { deleteFile } = require("../../utils/deleteFile");
const Book = require("../models/books");

const createBook = async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ message: "Only admins can create books" });
    }

    const { title, author } = req.body;

    const existingBook = await Book.findOne({ title, author });
    if (existingBook) {
      return res.status(400).json({ message: "This book already exists" });
    }

    const book = new Book(req.body);
    if (req.files) {
      book.bookImg = req.files.bookImg[0].path;
    }
    await book.save();
    res.status(201).json({ message: "Book successfully created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book === null) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (book === null) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book === null) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    deleteFile(book.bookImg);
    res.json({ message: "Libro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
