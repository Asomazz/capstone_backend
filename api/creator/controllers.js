const bcrypt = require("bcrypt");
const Creator = require("../../models/Creator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (creator) => {
  const payload = {
    _id: creator._id,
    username: creator.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXP,
  });

  return token;
};

const register = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newCreator = await Creator.create(req.body);

    const token = generateToken(newCreator);

    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  register,
};
