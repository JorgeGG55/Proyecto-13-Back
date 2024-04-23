const express = require("express");
const commentRoute = express.Router();
const commentController = require("../controllers/comment");
const authenticateToken = require("../../middlewares/auth");

commentRoute.get(
  "/comments",
  authenticateToken,
  commentController.getAllCommentsByUser
);
commentRoute.post(
  "/:bookId",
  authenticateToken,
  commentController.createComment
);
commentRoute.delete("/:id", authenticateToken, commentController.deleteComment);

//rutas sin usuario
commentRoute.get("/", commentController.getAllComments);
commentRoute.get("/:id", commentController.getCommentById);
commentRoute.get("/book/:id", commentController.getAllCommentsByBookId);

module.exports = commentRoute;
