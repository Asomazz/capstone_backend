const express = require("express");
const productRouter = express.Router();
const {
  createOneProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCreator,
} = require("./controllers");
const passport = require("passport");
const upload = require("../../middlewares/multer");

productRouter.get("/", getAllProducts);

productRouter.get("/creator/:creatorUsername", getProductsByCreator);

productRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  createOneProduct
);

productRouter.get("/:id", getProduct);

productRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateProduct
);

productRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteProduct
);

module.exports = productRouter;
