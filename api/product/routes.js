const express = require("express");
const router = express.Router();
const { createOneProduct } = require("./controllers");

router.post("/", createOneProduct);

module.exports = router;
