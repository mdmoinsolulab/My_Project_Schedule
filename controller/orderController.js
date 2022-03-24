import Order from "../models/Order.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";

//CREATE ORDER
const addOrder = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const newOrder = new Order(req.body);
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
    req.body.userId = req.user.id;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: { $eq: req.params.orderId }, userId: { $eq: req.user.id } },
      {
        $set: req.body,
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
    req.body.userId = req.params.userId;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: { $eq: req.params.orderId }, userId: { $eq: req.params.userId } },
      {
        $set: req.body,
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
    const order = await Order.findOneAndDelete({
      id_: { $eq: req.params.orderId },
      userId: { $eq: req.user.id },
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
    const order = await Order.findOneAndDelete({
      id_: { $eq: req.params.orderId },
      userId: { $eq: req.params.userId },
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
    if (req.headers.page) {
      if (req.headers.page <= 0) {
        req.headers.page = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit <= 0) {
        req.headers.limit = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit > 100) {
        req.headers.limit = 100;
      }
    }
    const orders = await Order.find({ userId: req.user.id })
      .limit(req.headers.limit * 1)
      .skip((req.headers.page - 1) * req.headers.limit);
    if (!orders) {
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
    if (req.headers.page) {
      if (req.headers.page <= 0) {
        req.headers.page = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit <= 0) {
        req.headers.limit = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit > 100) {
        req.headers.limit = 100;
      }
    }
    const orders = await Order.find({ userId: req.params.userId })
      .limit(req.headers.limit * 1)
      .skip((req.headers.page - 1) * req.headers.limit);
    if (!orders) {
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
    if (req.headers.page) {
      if (req.headers.page <= 0) {
        req.headers.page = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit <= 0) {
        req.headers.limit = 1;
      }
    }
    if (req.headers.limit) {
      if (req.headers.limit > 100) {
        req.headers.limit = 100;
      }
    }
    const orders = await Order.find()
      .limit(req.headers.limit * 1)
      .skip((req.headers.page - 1) * req.headers.limit);
    if (!orders) {
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
