const Discount = require("../models/Discount");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndVendor,
} = require("./verifyToken");
const router = require("express").Router();
const { sendResponse } = require('../helpers/responseSender');

//CREATE
router.post("/addDiscount/:id", verifyTokenAndAuthorization, async (req, res) => {
    const newDiscount = new Discount(req.body);   
    try {
        
      const savedDiscount = await newDiscount.save();
      sendResponse(res, 200, savedDiscount);
    } catch (err) {
      sendResponse(res, 500, err);
    }
  });

//DELETE
router.delete("/deleteDiscount/:id/:productId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedDiscounts = await Discount.findOneAndDelete({ productId: req.params.productId });
    sendResponse(res, 200, deletedDiscounts);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//GET ALL
router.get("/getDiscounts/:id/:productId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const discounts = await Discount.find({ productId: req.params.productId });
        sendResponse(res, 200, discounts);
    } catch (err) {
      sendResponse(res, 500, err);
    }
});



module.exports = router;
