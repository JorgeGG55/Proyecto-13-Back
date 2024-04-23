const jwt = require("jsonwebtoken");

const generateAuthToken = (usuario) => {
  return jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET);
};

module.exports = generateAuthToken;
