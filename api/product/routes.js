const express = require("express");
const router = express.Router();
const { createOneProduct } = require("./controllers");
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createOneProduct
);

module.exports = router;
