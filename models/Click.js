const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema(
  {
    productClick: { type: Boolean, default: false },
    buyNowClick: { type: Boolean, default: false },
    addToCartClick: { type: Boolean, default: false },
    storeClick: { type: Boolean, default: false },
    instagramClick: { type: Boolean, default: false },
    tiktokClick: { type: Boolean, default: false },
    snapchatClick: { type: Boolean, default: false },
    twitterClick: { type: Boolean, default: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Click", ClickSchema);
