const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    image: {
      type: String,
      default: "media/image.jpeg",
    },
    file: {
      type: String,
    },
    price: { type: Number, default: 0 },
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
    receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
    clicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
