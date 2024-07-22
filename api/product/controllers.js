const Creator = require("../../models/Creator.js");
const Product = require("../../models/Product.js");

const createOneProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.user = req.user._id;
    if (req.file) {
      req.body.image = req.file.path;
    }

    const newProduct = await Product.create(req.body);

    // Assuming you have req.body.creatorId correctly set
    await Creator.findOneAndUpdate(
      { _id: req.user._id },
      {
        $push: { products: newProduct._id },
      }
    );
    return res.status(201).json(newProduct);
  } catch (error) {
    return next(error);
  }
};
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
};

// const getProductsByCreator = async (req, res, next) => {
//   try {
//     console.log(req.params.creatorId);
//     const products = await Creator.find({
//       creator: req.params.creatorId,
//     }).populate("products");
//     return res.json(products);
//   } catch (error) {
//     return next(error);
//   }
// };

const getProductsByCreator = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({
      username: req.params.creatorUsername,
    })
      .populate("products")
      .select("-password -email");
    console.log(creator);
    if (!creator || creator.length == 0) {
      return res.status(404).json({ message: "Creator not found" });
    }
    return res.json(creator);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOneProduct,
  getAllProducts,
  getProductsByCreator,
  getProductById,
};
