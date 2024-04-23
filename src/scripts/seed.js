const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const User = require("../api/models/user");
const Book = require("../api/models/books");
const Loan = require("../api/models/loan");

const seedData = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const {
          user_ID,
          book_ID,
          "Loan Date": loanDate,
          "Return Date": returnDate,
        } = row;
        const newLoan = new Loan({
          user_ID,
          book_ID,
          loanDate: new Date(loanDate),
          returnDate: new Date(returnDate),
        });
        results.push(newLoan);
      })
      .on("end", () => {
        Loan.insertMany(results)
          .then(() => {
            console.log("Préstamos guardados exitosamente.");
            resolve();
          })
          .catch((error) => {
            console.error("Error al guardar los préstamos:", error);
            reject(error);
          });
      })
      .on("error", (error) => {
        console.error("Error al leer el archivo CSV:", error);
        reject(error);
      });
  });
};

module.exports = seedData;
