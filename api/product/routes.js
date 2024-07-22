const express = require("express");
const productRouter = express.Router();
const passport = require("passport");
const {
  createOneProduct,
  getAllProducts,
  getProductsByCreator,
} = require("./controllers");

productRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllProducts
);

productRouter.get("/creator/:creatorUsername", getProductsByCreator);

productRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createOneProduct
);

module.exports = productRouter;
