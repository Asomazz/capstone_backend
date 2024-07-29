const Creator = require("../../models/Creator");
const Receipt = require("../../models/Receipt");
const sendEXPONotification = require("../utils/notifications");

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = Receipt.find({ creator: req.params._id });
    return res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.sendNotification = async (req, res, next) => {
  try {
    const creator = await Creator.findById(req.params._id);

    sendEXPONotification(
      creator.notification_token,
      `You got a new order from ${req.body.customerName} with a total amount of ${req.body.totalAmount}`,
      "New Order"
    );
    const notification = await Receipt.create({
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      customerEmail: req.body.customerEmail,
      customerName: req.body.customerName,
    });

    await Creator.findByIdAndUpdate(Creator._id, {
      $push: { notifications: Receipt._id },
    });

    return res.json(notification);
  } catch (error) {
    next(error);
  }
};
