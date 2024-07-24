const express = require("express");
const receiptRouter = express.Router();
const { getReceipt, createReceipt, getRevenue } = require("./controllers");
const passport = require("passport");

receiptRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getReceipt
);

receiptRouter.post(
  "/",
  createReceipt
);
receiptRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getRevenue
);

module.exports = receiptRouter;
