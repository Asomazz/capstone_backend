const express = require("express");

const { getProfile, register, updateProfile, login } = require("./controllers");

const upload = require("../../middlewares/multer");
const passport = require("passport");

const creatorRouter = express.Router();

creatorRouter.get(
  "/profile/",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

creatorRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

creatorRouter.post("/register/", register);
creatorRouter.put(
  "/profile/",
  passport.authenticate("jwt", { session: false }),
  // upload.single("image"),
  updateProfile
);

module.exports = creatorRouter;
