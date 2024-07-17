const express = require("express");

const { register } = require("./controllers");

const contentcreatorRouter = express.Router();

contentcreatorRouter.post("/register", register);

module.exports = contentcreatorRouter;
