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
  notification_token: {type: String},
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  instagram: { type: String },
  tiktok: { type: String },
  snapchat: { type: String },
  twitter: { type: String },
  tiktok: { type: String },
  clicks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Click" }],
});

module.exports = mongoose.model("Creator", CreatorSchema);
