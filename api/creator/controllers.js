const bcrypt = require("bcrypt");
const Creator = require("../../models/Creator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (creator) => {
  const payload = {
    _id: creator._id,
    username: creator.username,
    email: creator.email,
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
    const profile = await Creator.findById(req.user._id)

      .select("-password")
      .populate("receipts products");
    return res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    const updatedData = {};
    for (const key in req.body) {
      if (req.body[key]) {
        updatedData[key] = req.body[key];
      }
    }

    const updatedProfile = await Creator.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    );
    return res.status(200).json(updatedProfile);
  } catch (error) {
    return next(error);
  }
};

const login = (req, res, next) => {
  try {
    const token = generateToken(req.user);
    return res.json({ token });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  generateToken,
  register,
  getProfile,
  updateProfile,
  login,
};
