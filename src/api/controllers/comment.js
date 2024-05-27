const Comment = require("../models/comment");
const Book = require("../models/books");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user_ID", "name")
      .populate("book_ID", "title");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comments = await Comment.findById(req.params.id)
      .populate("user_ID")
      .populate("book_ID");
    if (!comments) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCommentsByBookId = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ book_ID: id })

      .select("content")
      .select("book_ID")
      .populate("user_ID")
      .select("createdDate");

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const user_ID = req.user.id;
    const { bookId } = req.params;
    const { content } = req.body;

    const existingComment = await Comment.findOne({ user_ID, book_ID: bookId });
    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You have already made a comment for this book" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const comment = new Comment({ user_ID, book_ID: bookId, content });
    await comment.save();

    res.status(201).json({ message: "Comment published successfully!" });
  } catch (error) {
    res.status(400).json({ message: "The comment cannot be empty" });
  }
};

const getAllCommentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const comments = await Comment.find({ user_ID: userId })
      .populate("book_ID", "title bookImg")
      .select("content")
      .select("book_ID")
      .select("createdDate");

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this user." });
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const deletedComment = await Comment.findByIdAndDelete(reviewId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    res.json({ message: "Comment successfully removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  getAllCommentsByBookId,
  createComment,
  deleteComment,
  getAllCommentsByUser,
};
