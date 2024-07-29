const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String },
  name: { type: String },
  bio: { type: String },
  revenue: { type: Number, default: 0 },
  receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  instagram: { type: String },
  tiktok: { type: String },
  snapchat: { type: String },
  twitter: { type: String },
  tiktok: { type: String },
  storeClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
  instagramClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
  tiktokClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
  snapchatClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
  twitterClicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
});

module.exports = mongoose.model("Creator", CreatorSchema);
