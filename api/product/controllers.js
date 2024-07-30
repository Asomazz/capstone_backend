const Click = require("../../models/Click.js");
const Creator = require("../../models/Creator.js");
const Product = require("../../models/Product.js");

const createOneProduct = async (req, res, next) => {
  try {
    req.body.creator = req.user._id;

    if (req.files.image) {
      req.body.image = req.files.image[0].path.replace("\\", "/");
    }

    if (req.files.pdf) {
      req.body.file = req.files.pdf[0].path.replace("\\", "/");
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
    const id = req.params.id;
    const product = await Product.findById(id).populate(
      "creator",
      "name username _id"
    );
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

const extraClicksTracker = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (req.body.type == "buy") {
      const click = await Click.create({
        product: product._id,
        buyNowClick: true,
      });
      await product.updateOne({ $push: { clicks: click._id } });
    } else if (req.body.type == "cart") {
      const click = await Click.create({
        product: product._id,
        addToCartClick: true,
      });
      await product.updateOne({ $push: { clicks: click._id } });
    } else {
      res.status(404).json({ message: "type is not there" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

const socialMediaClicksTracker = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({
      username: req.params.creatorUsername,
    });

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    if (req.body.type == "instagram") {
      const click = await Click.create({
        creator: creator._id,
        instagramClick: true,
      });
      await creator.updateOne({ $push: { clicks: click._id } });
    }
    if (req.body.type == "tiktok") {
      const click = await Click.create({
        creator: creator._id,
        tiktokClick: true,
      });
      await creator.updateOne({ $push: { clicks: click._id } });
    }
    if (req.body.type == "snapchat") {
      const click = await Click.create({
        creator: creator._id,
        snapchatClick: true,
      });
      await creator.updateOne({ $push: { clicks: click._id } });
    }
    if (req.body.type == "twitter") {
      const click = await Click.create({
        creator: creator._id,
        twitterClick: true,
      });
      await creator.updateOne({ $push: { clicks: click._id } });
    }

    return res.status(200).json(creator);
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
  socialMediaClicksTracker,
};
