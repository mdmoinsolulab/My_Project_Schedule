const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const { sendResponse } = require('../helpers/responseSender');

//CREATE

router.post("/addOrder", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    sendResponse(res, 200, savedOrder);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//UPDATE
router.put("/updateOrder/:id/:productId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.productId,
      {
        $set: req.body,
      },
      { new: true }
    );
    sendResponse(res, 200, updatedOrder);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//DELETE
router.delete("/deleteOrder/:id/:productId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.productId);
    sendResponse(res, 200, "Order has been deleted...");
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//GET USER ORDERS
router.get("/getOrder/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });
    sendResponse(res, 500, orders);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

// //GET ALL

router.get("/getAllOrders", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    sendResponse(res, 200, orders);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

// GET MONTHLY INCOME

router.get("/getincome", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    sendResponse(res, 200, income);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

module.exports = router;
