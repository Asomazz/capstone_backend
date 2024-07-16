const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  paymentMethod: { type: String},
  paymentDate: { type: Date, default: Date.now },
  amount:{ type: Number},
});

module.exports = mongoose.model('Payment', paymentSchema);
