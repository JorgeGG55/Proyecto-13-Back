const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
    content: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
  },
  {
    collection: "comments",
  }
);

commentSchema.virtual("formattedCreatedAt").get(function () {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return this.createdDate.toLocaleDateString("en-US", options);
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
