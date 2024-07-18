const Creator = require("../models/Creator");
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
      const creator = await Creator.findOne({
        username: username,
      });
      if (!creator) {
        return next({ msg: "Username or password is wrong!" });
      }
      const checkPassword = await bcrypt.compare(password, creator.password);
      if (checkPassword == false) {
        return next({ msg: "Username or password is wrong!" });
      }
      next(false, creator);
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
      return next({ msg: "Token expired!" });
    }

    const creator = await Creator.findById(payload._id);

    if (!creator) {
      return next({ msg: "User not found!" });
    }

    next(false, creator);
  }
);

module.exports = { localStrategy, jwtStrategy };
