const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name:{type: String },
  email: { type: String, required: true },
  image: { type: String, defult: "link" },
  bio: { type: String},
  role: { type: String, enum: ['Creator', 'Customer'], default: 'Customer' },
  
});

module.exports = mongoose.model("User", UserSchema);
