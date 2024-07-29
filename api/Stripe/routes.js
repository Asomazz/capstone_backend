const express = require("express");
const { createPaymentIntent } = require("../Stripe/controllers");

const stripeRouter = express.Router();

stripeRouter.post("/create-payment-intent", createPaymentIntent);

module.exports = stripeRouter;

////////////////////////////
