const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema(
  {
    totalAmount: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    customerEmail: { type: String, required: true },
    customerName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receipt", ReceiptSchema);
