const Product = require("../../models/Product.js");

// const createOneProduct = async (req, res, next) => {
//   try {
//     req.body.user = req.user._id;
//     if (req.file) {
//       req.body.image = req.file.path;
//     }

//     // const product = {
//     //   title: req.body.title,
//     //   description: req.body.description,
//     //   image: req.body.image,
//     //   price: req.body.price,

//     // };

//     const newProduct = await Product.create(req.body);
//     // Update the creator with the products
//     await Creator.findOneAndUpdate(
//       { _id: req.body.creatorId },
//       {
//         $push: { products: newProduct._id },
//       }
//     );
//     return res.status(201).json(newProduct);
//   } catch (error) {
//     return next(error);
//   }
// };
const createOneProduct = async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    if (req.file) {
      req.body.image = req.file.path;
    }

    const newProduct = await Product.create(req.body);

    // Assuming you have req.body.creatorId correctly set
    await Creator.findOneAndUpdate(
      { _id: req.body.creatorId },
      {
        $push: { products: newProduct._id },
      }
    );

    return res.status(201).json(newProduct);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOneProduct,
};
