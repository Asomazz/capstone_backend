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
    console.log(req.body);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newCreator = await Creator.create(req.body);

    const token = generateToken(newCreator);

    return res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    return res.json(req.user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }
    const updatedProfile = await Creator.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedProfile);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateToken,
  register,
  getProfile,
  updateProfile,
};
