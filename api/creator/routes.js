const express = require("express");

const { register } = require("./controllers");

const creatorRouter = express.Router();

creatorRouter.post("/register", register);

module.exports = creatorRouter;
