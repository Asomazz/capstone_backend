const ContentCreator = require("../models/ContentCreator");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
require("dotenv").config();

const localStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, next) => {
    try {
      const contentCreator = await ContentCreator.findOne({
        username: username,
      });
      if (!contentCreator) {
        return next({ msg: "Username or password is wrong!" });
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword == false) {
        return next({ msg: "Username or password is wrong!" });
      }
      next(false, contentCreator);
    } catch (error) {
      next(error);
    }
  }
);

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, next) => {
    // here you check if token is exp

    // console.log("EXP:", payload.exp, "Time now", Date.now() / 1000);

    if (Date.now() / 1000 > payload.exp) {
      return next({ msg: "Token expiered!" });
    }

    const contentCreator = await ContentCreator.findById(payload._id);

    if (!contentCreator) {
      return next({ msg: "User not found!" });
    }

    next(false, contentCreator);
  }
);

module.exports = { localStrategy, jwtStrategy };
