const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "media/image.jpeg",
  },
  price: Number,
<<<<<<< HEAD
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
  },
  // receipt: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" },
=======
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
  receipt: { type: mongoose.Schema.Types.ObjectId, ref: "Receipt" },
>>>>>>> origin/main
});

module.exports = mongoose.model("Product", ProductSchema);
