const express = require("express");
const revieswRoutes = express.Router();
const reviewController = require("../controllers/review");
const authenticateToken = require("../../middlewares/auth");

//rutas con usuario
revieswRoutes.get(
  "/reviews",
  authenticateToken,
  reviewController.getAllReviewByUser
);
revieswRoutes.post(
  "/:bookId",
  authenticateToken,
  reviewController.createReview
);
revieswRoutes.delete("/:id", authenticateToken, reviewController.deleteReview);

//rutas sin usuario
revieswRoutes.get("/", reviewController.getAllReviews);
revieswRoutes.get("/:id", reviewController.getReviewById);
revieswRoutes.get("/book/:id", reviewController.getAllReviewByBookId);

module.exports = revieswRoutes;
