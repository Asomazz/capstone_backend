// controllers/stripeController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  let { amount } = req.body;

  // Ensure amount is a valid number
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).send("Invalid amount.");
  }

  // For KWD, amount must be divisible by 10
  if (amount % 10 !== 0) {
    amount = Math.round(amount / 10) * 10;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "KWD",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Server error");
  }
};

module.exports = { createPaymentIntent };
