import Cart from "../models/Cart.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";
import { validateParams } from "../utils/newValidate.js";

//CREATE CART
const addCart = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const newCart = new Cart(req.body);
    await newCart.save();
    if (!newCart) {
      return sendResponse(res, 404, "Failed to add the cart");
    }
    sendResponse(res, 200, newCart);
  } catch (err) {
    sendResponse(res, 500, err);
  }
};

//UPDATE
const updateCart = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: { $eq: req.user.id } },
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedCart) {
      return sendResponse(res, 404, "Failed to update the cart");
    }
    return sendResponse(res, 200, updatedCart);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE
const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: { $eq: req.user.id } });
    if (!cart) {
      return sendResponse(res, 404, "No Cart to Delete");
    }
    return sendResponse(res, 200, "Cart has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE PRODUCT ITEM
const deleteCartItem = async (req, res) => {
  try {
    const checkResult = validateParams(req.params.productId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    let cart = await Cart.findOne({ userId: { $eq: req.user.id } });
    if (!cart) {
      return sendResponse(res, 404, "No Cart Found");
    }
    let i = 0;
    let found = false;

    if (cart.products && cart.products.length > 0) {
      for (i = 0; i < cart.products.length; i++) {
        if (req.params.productId == cart.products[i].productId) {
          found = true;
          break;
        }
      }
      if (found) {
        cart.products.splice(i, 1);
        const newCart = new Cart(cart);
        await newCart.save();
        if (!newCart) {
          return sendResponse(res, 404, "Failed to Delete Try Later");
        } else {
          return sendResponse(res, 200, "Cart item has been deleted...");
        }
      } else {
        return sendResponse(res, 404, "Could not find the product to delete");
      }
      //return sendResponse(res, 200, "Cart has been deleted...");
    } else {
      return sendResponse(res, 404, "No Items to delete");
    }
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER CART
const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: { $eq: req.user.id } }).
                 populate('products.productId');
    // const cart = await Cart.findOne({ userId: { $eq: req.user.id } });
    if (!cart || cart.products.length < 1) {
      return sendResponse(res, 404, "Your Cart Is Empty");
    }

    return sendResponse(res, 200, cart);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER CART FOR ADMIN
const getUserCartForAdmin = async (req, res) => {
  try {
    const checkResult = validateParams(req.params.userId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    //const cart = await Cart.findOne({ userId: { $eq: req.params.userId } });
    const cart = await Cart.findOne({ userId: { $eq: req.params.userId } }).
    populate('products.productId');
    if (!cart || cart.products.length < 1) {
      return sendResponse(res, 404, "User Cart Is Empty");
    }
    return sendResponse(res, 200, cart);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET ALL USERS CARTS
const getAllUsersCarts = async (req, res) => {
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
    const carts = await Cart.find()
      .limit(req.headers.limit * 1)
      .skip((req.headers.page - 1) * req.headers.limit)
      .populate('products.productId');
    if (!carts || !carts.length) {
      return sendResponse(res, 404, "No Cart Available");
    }
    return sendResponse(res, 200, carts);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

export {
  addCart,
  updateCart,
  deleteCart,
  deleteCartItem,
  getUserCart,
  getUserCartForAdmin,
  getAllUsersCarts,
};
