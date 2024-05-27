const Review = require("../models/review");
const Book = require("../models/books");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user_ID", "name")
      .populate("book_ID", "title");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user_ID", "name")
      .populate("book_ID", "title");
    if (!review) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviewByBookId = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "No se encontró ningún libro con el ID especificado",
      });
    }

    const reviews = await Review.find({ book_ID: id })
      .select("rating")
      .populate("user_ID", "name");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        message: "No se encontraron reseñas para el libro especificado",
      });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    let { rating } = req.body;

    if (rating < 1) {
      rating = 1;
    } else if (rating > 5) {
      rating = 5;
    }

    const user_ID = req.user.id;
    const { bookId } = req.params;

    const existingReview = await Review.findOne({ user_ID, book_ID: bookId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already rated this book" });
    }

    const review = new Review({ user_ID, book_ID: bookId, rating });
    await review.save();

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const reviews = await Review.find({ book_ID: bookId });
    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    book.rating = Math.round(totalRatings / reviews.length);
    await book.save();

    res.status(201).json({ message: "Rating published successfully!" });
  } catch (error) {
    res.status(400).json({ message: "The rating cannot be empty" });
  }
};

const getAllReviewByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ user_ID: userId })
      .populate("book_ID", "title bookImg")
      .select("rating");

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this user" });
    }

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    const bookId = deletedReview.book_ID;
    const reviews = await Review.find({ book_ID: bookId });
    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (reviews.length > 0) {
      book.rating = Math.round(totalRatings / reviews.length);
    } else {
      book.rating = 0;
    }

    await book.save();

    res.json({ message: "Rating successfully removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  getAllReviewByBookId,
  getAllReviewByUser,
};
