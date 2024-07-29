const express = require("express");
const { getMyNotifications, sendNotification } = require("./controllers");

const router = express.Router();

router.get("/myNotifications/:_id", getMyNotifications);
router.post("/sendNotification/:_id", sendNotification);

module.exports = router;
