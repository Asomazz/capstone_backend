const Receipt = require("../../models/Receipt");
const Creator = require("../../models/Creator");
const Product = require("../../models/Product");
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

    // Get product details and generate download links if they have files
    const productDetails = await Product.find({
      _id: { $in: receipt.products },
    });
    const productList = productDetails
      .map((product) => {
        if (product.file) {
          return `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${product.title}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <a href="${process.env.SERVER_URL}/${product.file}" download style="color: #0066cc; text-decoration: none;">Download</a>
            </td>
          </tr>
        `;
        }
        return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${product.title}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">No file available</td>
        </tr>
      `;
      })
      .join("");

    // Send email to the customer

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receipt.customerEmail,
      subject: "Your Receipt",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #0066cc;">Hello ${receipt.customerName},</h1>
          <p>Thank you for your purchase. Here are your receipt details:</p>
          <p><strong>Total Amount:</strong> ${receipt.totalAmount}</p>
          <h2 style="color: #0066cc;">Products Purchased</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Product</th>
                <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Download Link</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
          </table>
          <p style="margin-top: 20px;">Best regards,<br>Your Company</p>
        </div>
      `,
    };


    // await transporter.sendMail(mailOptions);

    return res.status(201).json(receipt);
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
