const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "media/image.jpeg",
  },
  price: { type: Number, default: 0 },
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
  // receipt: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" },
});

module.exports = mongoose.model("Product", ProductSchema);
