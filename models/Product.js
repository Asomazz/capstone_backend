const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "media/image.jpeg",
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
},{ timestamps: true,});

module.exports = mongoose.model("Product", ProductSchema);
