const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: { type: Number, required: true },
  },
  {
    collection: "reviews",
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
