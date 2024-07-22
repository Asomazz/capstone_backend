const express = require("express");
const receiptRouter = express.Router();
const { getReceipt,createReceipt } = require("./controllers");
const passport = require("passport");

receiptRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getReceipt
);

module.exports = receiptRouter;
