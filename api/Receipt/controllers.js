const Receipt = require("../../models/Receipt");
const Creator = require("../../models/Creator");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.create(req.body);

    // Find the creator and update the revenue
    const creator = await Creator.findById(receipt.creator);

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    creator.revenue += receipt.totalAmount;
    creator.receipts.push(receipt._id);
    await creator.save();

    // Send email to the customer

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: receipt.customerEmail,
    //   subject: "Your Receipt",
    //   text: `Hello ${receipt.customerName},\n\nThank you for your purchase. Here are your receipt details:\n\nTotal Amount: ${receipt.totalAmount}\n\nLink to download your product: <link_placeholder>\n\nBest regards,\nYour Company`,
    // };

    // await transporter.sendMail(mailOptions);

    return res.json(receipt);
  } catch (error) {
    next(error);
  }
};

const getReceipt = async (req, res, next) => {
  try {
    const receipt = await Receipt.findById(req.params._id).populate(
      "creator products",
      "-password"
    );
    return res.json(receipt);
  } catch (error) {
    next(error);
  }
};

const getAllReceipt = async (req, res, next) => {
  try {
    const receipts = await Receipt.find();
    return res.json(receipts);
  } catch (error) {
    next(error);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const creatorId = req.user._id;
    const creator = await Creator.findById(creatorId).populate("products");
    const totalRevenue = creator.revenue;
    const dailyRevenue = await Receipt.aggregate([
      { $match: { creator: creatorId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalRevenue, dailyRevenue });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReceipt,
  getReceipt,
  getRevenue,
  getAllReceipt,
};
