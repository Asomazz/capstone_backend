const Receipt = require("../../models/Receipt");
require("dotenv").config();

const createReceipt = async (req,res,next)=>{
    try {
        const receipt = await Receipt.create(req.body)
        return res.json(receipt);
    } catch (error) {
      next(error);
    }
}

const getReceipt = async (req, res, next) => {
    try {
        const receipt = await Receipt.find()
      return res.json(receipt);
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    getReceipt,
    createReceipt
  };