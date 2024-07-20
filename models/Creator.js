const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: { type: String },
  name: { type: String },
  bio: { type: String },
  revenue: { type: Number },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: "Links" }],
});

module.exports = mongoose.model("Creator", CreatorSchema);
