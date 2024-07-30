const mongoose = require("mongoose");

// Define the schema first
const ReceiptSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, unique: true },
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

// Function to generate a unique receipt number
const generateReceiptNumber = async () => {
  const count = await mongoose.models.Receipt.countDocuments();
  return `REC-${count + 1}`;
};

// Pre-save hook to generate unique receipt number
ReceiptSchema.pre("save", async function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber = await generateReceiptNumber();
  }
  next();
});

// Define and export the model
const Receipt = mongoose.model("Receipt", ReceiptSchema);
module.exports = Receipt;
