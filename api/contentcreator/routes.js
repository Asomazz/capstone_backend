const express = require("express");

const { getProfile, register, updateProfile } = require("./controllers");

const upload = require("../../middlewares/multer");
const passport = require("passport");

const contentcreatorRouter = express.Router();

contentcreatorRouter.get(
  "/profile/",
  passport.authenticate("jwt", { session: false }),
  getProfile
);
contentcreatorRouter.post("/register", register);
contentcreatorRouter.put("/profile/:id", upload.single("image"), updateProfile);

module.exports = contentcreatorRouter;
