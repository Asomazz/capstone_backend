const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalAmount: { type: Number },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
});

module.exports = mongoose.model('Order', orderSchema);
