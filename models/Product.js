const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default:
      "https://cdn.vectorstock.com/i/500p/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg",
  },
  price: Number,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
  },
  // receipt: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" },
});

module.exports = mongoose.model("Product", ProductSchema);
