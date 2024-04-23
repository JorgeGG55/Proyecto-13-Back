const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
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
    loanDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
  },
  {
    collection: "loans",
  }
);

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
