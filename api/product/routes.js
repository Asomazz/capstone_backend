const express = require("express");
const productRouter = express.Router();
const passport = require("passport");
const {
  createOneProduct,
  getAllProducts,
  getProductsByCreator,
  getProductById,
} = require("./controllers");

const upload = require("../../middlewares/multer");

productRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllProducts
);

productRouter.get("/creator/:creatorUsername", getProductsByCreator);

productRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  createOneProduct
);

productRouter.get("/one/:productId", getProductById);

module.exports = productRouter;
