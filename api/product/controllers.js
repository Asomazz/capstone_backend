const Creator = require("../../models/Creator.js");
const Product = require("../../models/Product.js");

const createOneProduct = async (req, res, next) => {
  try {
    req.body.creator = req.user._id;
    if (req.file) {
      req.body.image = req.file.path;
    }
    console.log(req.body.image);
    const newProduct = await Product.create(req.body);

    await Creator.findByIdAndUpdate(req.body.creator, {
      $push: { products: newProduct._id },
    });

    const populatedProduct = await Product.findById(newProduct._id).populate(
      "creator",
      "name username _id"
    );

    return res.status(201).json(populatedProduct);
  } catch (error) {
    return next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const creatorId = req.user._id;

    const products = await Product.find({ creator: creatorId }).populate(
      "creator",
      "name username _id"
    );

    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate(
      "creator",
      "name username _id"
    );
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "No product with this ID" });
    }
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.file) {
      req.body.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("creator", "name username _id");
    if (updatedProduct) {
      return res.status(200).json(updatedProduct);
    } else {
      return res.status(404).json({ message: "No product with this ID" });
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      await Creator.findByIdAndUpdate(product.creator, {
        $pull: { products: product._id },
      });
      return res.status(200).json({ message: "Product successfully deleted" });
    } else {
      return res.status(404).json({ message: "No product with this ID" });
    }
  } catch (error) {
    return next(error);
  }
};

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

module.exports = {
  createOneProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCreator,
};
