const bcrypt = require("bcrypt");
const ContentCreator = require("../../models/ContentCreator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (contentCreator) => {
  const payload = {
    _id: contentCreator._id,
    username: contentCreator.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXP,
  });

  return token;
};

const register = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newContentCreator = await ContentCreator.create(req.body);

    const token = generateToken(newContentCreator);

    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  register,
};
