const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    image: {
      type: String,
      default: "media/image.jpeg",
    },
    price: { type: Number, default: 0 },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
    receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
    productClicks: { type: Number, default: 0 },
    buyNowClicks: { type: Number, default: 0 },
    addToCartClicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
