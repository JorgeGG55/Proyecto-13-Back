const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookImg: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: [String], required: true },
    description: { type: String },
    units: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
  },
  {
    collection: "books",
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
