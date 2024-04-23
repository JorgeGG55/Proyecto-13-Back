require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const { cloudinary } = require("./src/config/cloudinary");
const cors = require("cors");

const booksRoutes = require("./src/api/routes/booksRoutes");
const loansRoutes = require("./src/api/routes/loansRoutes");
const reviewsRoutes = require("./src/api/routes/reviewRoutes");
const authRoutes = require("./src/api/routes/authRoutes");
const commentRoute = require("./src/api/routes/commentRoutes");
const userRoutes = require("./src/api/routes/userRoutes");
const { scheduleDailyCleanup } = require("./src/utils/scheduleCleanup");

const app = express();
app.use(express.json());
app.use(cors());
connectDB();
scheduleDailyCleanup();
cloudinary;

app.use("/api/books", booksRoutes);
app.use("/api/loans", loansRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/users", userRoutes);

app.use("*", (req, res, next) => {
  return res.status(404).json("Route not found");
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});
