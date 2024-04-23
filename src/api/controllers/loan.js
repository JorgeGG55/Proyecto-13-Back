const Loan = require("../models/loan");
const Book = require("../models/books");

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find();
    if (loans.length === 0) {
      res.status(404).json({ message: "No existen préstamos." });
    } else {
      res.json(loans);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate("user_ID")
      .populate("book_ID");
    if (!loan) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLoan = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user_ID = req.user.id;

    const existingLoan = await Loan.findOne({ user_ID, book_ID: bookId });
    if (existingLoan) {
      return res
        .status(400)
        .json({ message: "You already have this book on loan" });
    }

    const loanDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 15);

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    if (book.units <= 0) {
      return res
        .status(400)
        .json({ message: "No hay existencias disponibles para este libro" });
    }

    const newLoan = new Loan({
      user_ID,
      book_ID: bookId,
      loanDate,
      returnDate,
    });

    book.units -= 1;
    await book.save();

    await newLoan.save();

    res.status(201).json({ message: "Loan successfully created!" });
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    const bookId = loan.book_ID;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    book.units += 1;
    await book.save();

    res.status(200).json({ message: "Loan successfully removed" });
  } catch (error) {
    console.error("Error al eliminar el préstamo:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getAllLoansByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await Loan.find({ user_ID: userId }).populate("book_ID");

    if (loans.length === 0) {
      res.status(404).json({
        message: "No se ha encontrado ningun prestamo asociado a tu cuenta",
      });
    } else {
      res.json(loans);
    }
  } catch (error) {
    console.error("Error al obtener préstamos del usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const deleteExpiredLoans = async () => {
  try {
    const currentDateTime = new Date();
    const expiredLoans = await Loan.find({
      returnDate: { $lt: currentDateTime },
    });

    for (const loan of expiredLoans) {
      const bookId = loan.book_ID;
      const book = await Book.findById(bookId);
      if (book) {
        book.units += 1;
        await book.save();
      }
      await Loan.findByIdAndDelete(loan._id);
    }
    console.log("Préstamos vencidos, eliminados correctamente");
  } catch (error) {
    console.error("Error al eliminar préstamos vencidos:", error);
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  deleteLoan,
  getAllLoansByUser,
  deleteExpiredLoans,
};
