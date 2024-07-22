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
creatorRouter.post("/register", register);
creatorRouter.put("/profile/:id", upload.single("image"), updateProfile);
creatorRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
module.exports = creatorRouter;
