const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String },
  name: { type: String },
  bio: { type: String },
  revenue: { type: Number, default: 0 },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receipt" }],
  instagram: { type: String },
  snapchat: { type: String },
  twitter: { type: String },
});

module.exports = mongoose.model("Creator", CreatorSchema);
