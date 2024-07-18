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

const getProfile = async (req, res, next) => {
  try {
    const contentCreator = await ContentCreator.findById(req.body._id);
    return res.json(contentCreator);
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
    const updatedProfile = await ContentCreator.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
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
