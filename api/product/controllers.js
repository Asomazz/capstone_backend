const Click = require("../../models/Click.js");
const Creator = require("../../models/Creator.js");
const Product = require("../../models/Product.js");

const createOneProduct = async (req, res, next) => {
  try {
    req.body.creator = req.user._id;

    if (req.files.image) {
      req.body.image = req.files.image[0].path;
    }

    if (req.files.pdf) {
      req.body.file = req.files.pdf[0].path;
    }

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
      "name username"
    );

    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

const getAllProductsCreator = async (req, res, next) => {
  try {
    const creatorId = req.user._id;

    const products = await Product.find({ creator: creatorId }).populate(
      "creator",
      "name username"
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
      const click = await Click.create({
        product: product._id,
        productClick: true,
      });

      await product.updateOne({ $push: { clicks: click._id } });

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
    if (req.files.image) {
      req.body.image = req.files.image[0].path;
    }

    if (req.files.pdf) {
      req.body.file = req.files.pdf[0].path;
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
      .populate({
        path: "products",
        model: "Product",
      })
      .select("-password -email");
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    const click = await Click.create({
      creator: creator._id,
      storeClick: true,
    });

    await creator.updateOne({ $push: { clicks: click._id } });

    return res.json(creator);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    const click = await Click.create({
      product: product._id,
      productClick: true,
    });
    console.log(click);

    await product.updateOne({ $push: { clicks: click._id } });
    console.log(product);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const extraClicksTracker = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (req.body.type == "buy") {
      product.buyNowClicks++;
      product.save();
    } else if (req.body.type == "cart") {
      product.addToCartClicks++;
      product.save();
    } else {
      res.status(404).json({ message: "type is not there" });
    }

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
  getProduct,
  updateProduct,
  deleteProduct,
  extraClicksTracker,
  getAllProductsCreator,
};
