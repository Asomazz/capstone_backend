const express = require("express");
const productRouter = express.Router();
const { createOneProduct } = require("./controllers");
const passport = require("passport");

productRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createOneProduct
);

module.exports = productRouter;
