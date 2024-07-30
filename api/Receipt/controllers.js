const Receipt = require("../../models/Receipt");
const Creator = require("../../models/Creator");
const Product = require("../../models/Product");
const nodemailer = require("nodemailer");
require("dotenv").config();

const createReceipt = async (req, res, next) => {
  try {
    const { products, customerName, customerEmail, creator } = req.body;

    // Count the quantity of each product
    const productCounts = products.reduce((counts, productId) => {
      counts[productId] = (counts[productId] || 0) + 1;
      return counts;
    }, {});

    const productIds = Object.keys(productCounts);

    // Get product details and calculate total amount considering quantities
    const productDetails = await Product.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    const productQuantities = {};

    productDetails.forEach((product) => {
      const quantity = productCounts[product._id.toString()];
      totalAmount += product.price * quantity;
      productQuantities[product._id.toString()] = quantity;
    });

    // Create the receipt with the calculated total amount
    const receipt = new Receipt({
      customerName,
      customerEmail,
      creator,
      products: productIds,
      totalAmount,
    });

    await receipt.save();

    // Find the creator and update the revenue
    const creatorDoc = await Creator.findById(receipt.creator);

    if (!creatorDoc) {
      return res.status(404).json({ message: "Creator not found" });
    }

    creatorDoc.revenue += receipt.totalAmount;
    creatorDoc.receipts.push(receipt._id);
    await creatorDoc.save();

    // Generate product list HTML for the email
    const productList = productDetails
      .map((product) => {
        const quantity = productQuantities[product._id.toString()];
        const totalProductPrice = product.price * quantity;
        if (product.file) {
          return `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              product.title
            } (x${quantity})</td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <a href="${process.env.SERVER_URL}/${
            product.file
          }" download style="color: #0066cc; text-decoration: none;">Download</a>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">${totalProductPrice.toFixed(
              2
            )}KD</td>
          </tr>
        `;
        }
        return `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${
            product.title
          } (x${quantity})</td>
          <td style="padding: 10px; border: 1px solid #ddd;">No file available</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${totalProductPrice.toFixed(
            2
          )}KD</td>
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
      subject: "Your Receipt from FluidStore",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #0066cc;">Hello ${receipt.customerName},</h1>
          <p>Thank you for your purchase from ${
            creatorDoc.name
          }'s store on FluidStore. Here are your receipt details:</p>
          <p><strong>Receipt Number:</strong> ${receipt.receiptNumber}</p>
          <p><strong>Total Amount:</strong> ${receipt.totalAmount.toFixed(
            2
          )}KD</p>
          <h2 style="color: #0066cc;">Products Purchased</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Product</th>
                <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Download Link</th>
                <th style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;">Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
          </table>
          <p style="margin-top: 20px;">Best regards,<br>FluidStore Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

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
