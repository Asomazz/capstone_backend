const express = require("express");
const productRouter = express.Router();
const {
  createOneProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCreator,
  getAllProductsCreator,
  extraClicksTracker,
  getProductById,
  socialMediaClicksTracker,
} = require("./controllers");
const passport = require("passport");
const upload = require("../../middlewares/multer");

productRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllProducts
);

productRouter.get(
  "/creator",
  passport.authenticate("jwt", { session: false }),
  getAllProductsCreator
);

productRouter.get("/creator/:creatorUsername", getProductsByCreator);

productRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createOneProduct
);

productRouter.get("/app/:id", getProductById);
productRouter.get("/:id", getProduct);

productRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateProduct
);

productRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteProduct
);

productRouter.put("/tracker/extra/:productId", extraClicksTracker);

productRouter.put("/treacker/social/:creatorId", socialMediaClicksTracker);

module.exports = productRouter;
