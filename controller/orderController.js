import Order from "../models/Order.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";
import { validateParams } from "../utils/newValidate.js";

//CREATE ORDER
const addOrder = async (req, res) => {
  try {
    const id = req.user.id;
    const { products, amount, address, status } = req.body;
    const newOrder = new Order(
      {
        userId: id,
        products: products,
        amount: amount,
        address: address,
        status: status,
      }
    );
    await newOrder.save();
    if (!newOrder) {
      return sendResponse(res, 404, "Failed to add the order");
    }
    return sendResponse(res, 200, newOrder);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const id = req.user.id;
    const { products, amount, address, status } = req.body;
    const { orderId } = req.params;
    const checkResult = validateParams(orderId);
    console.log('these are the results : ', checkResult);
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: { $eq: orderId }, userId: { $eq: id } },
      {
        //$set: req.body,
        $set: {
          products: products,
          amount: amount,
          address: address,
          status: status,
        }
      },
      { new: true }
    );
    if (!updatedOrder) {
      return sendResponse(res, 400, "Order Not Found");
    }
    return sendResponse(res, 200, updatedOrder);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//UPDATE ORDER FOR ADMIN
const updateOrderForAdmin = async (req, res) => {
  try {
    const { products, amount, address, status } = req.body;
    const { userId ,orderId } = req.params;
    const checkFirstResult = validateParams(userId);
    console.log('these are the results : ', checkFirstResult)
    if (checkFirstResult != true) {
      return sendResponse(res, 500, checkFirstResult);
    }
    const checkSecondResult = validateParams(orderId);
    console.log('these are the results : ', checkSecondResult)
    if (checkSecondResult != true) {
      return sendResponse(res, 500, checkSecondResult);
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: { $eq: orderId }, userId: { $eq: userId } },
      {
        //$set: req.body,
        $set: {
          products: products,
          amount: amount,
          address: address,
          status: status,
        }
      },
      { new: true }
    );
    if (!updatedOrder) {
      return sendResponse(res, 400, "Order Not Found");
    }
    return sendResponse(res, 200, updatedOrder);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const id = req.user.id;
    const { orderId } = req.params;
    const checkResult = validateParams(orderId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    const order = await Order.findOneAndDelete({
      _id: { $eq: orderId },
      userId: { $eq: id },
    });
    if (!order) {
      return sendResponse(res, 400, "Order Not Found");
    }
    return sendResponse(res, 200, "Order has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE ORDER FOR ADMIN
const deleteOrderForAdmin = async (req, res) => {
  try {
    const { userId ,orderId } = req.params;
    const checkFirstResult = validateParams(userId);
    console.log('these are the results : ', checkFirstResult)
    if (checkFirstResult != true) {
      return sendResponse(res, 500, checkFirstResult);
    }
    const checkSecondResult = validateParams(orderId);
    console.log('these are the results : ', checkSecondResult)
    if (checkSecondResult != true) {
      return sendResponse(res, 500, checkSecondResult);
    }
    const order = await Order.findOneAndDelete({
      _id: { $eq: orderId },
      userId: { $eq: userId },
    });
    if (!order) {
      return sendResponse(res, 400, "Order Not Found");
    }
    return sendResponse(res, 200, "Order has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER ORDERS
const getOrders = async (req, res) => {
  try {
    const id = req.user.id;
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");
    }
    
    const orders = await Order.find({ userId: id })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (!orders || !orders.length) {
      return sendResponse(res, 400, "No Orders Found");
    }
    return sendResponse(res, 500, orders);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER ORDERS FOR ADMIN
const getOrdersForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const checkResult = validateParams(userId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");
    }
    
    const orders = await Order.find({ userId: userId })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    if (!orders || !orders.length) {
      return sendResponse(res, 400, "No Orders Found");
    }
    return sendResponse(res, 500, orders);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET ALL ORDER FOR ADMIN
const getAllOrders = async (req, res) => {
  try {
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");
    }
    const orders = await Order.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    if (!orders || !orders.length) {
      return sendResponse(res, 400, "No Orders Found");
    }
    return sendResponse(res, 200, orders);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

// GET MONTHLY INCOME FOR ADMIN
const getIncome = async (req, res) => {
  try {
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");      
    }
    
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );
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
      { $limit : (limit * 1) },
      { $skip: (page * limit - limit)}
    ]);
    if (!income) {
      return sendResponse(res, 400, "No Data Found");
    }
    return sendResponse(res, 200, income);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

export {
  addOrder,
  updateOrder,
  updateOrderForAdmin,
  deleteOrder,
  deleteOrderForAdmin,
  getOrders,
  getOrdersForAdmin,
  getAllOrders,
  getIncome,
};
