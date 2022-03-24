import Cart from "../models/Cart.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";

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
    let cart = await Cart.find({ userId: { $eq: req.user.id } });
    if (!cart) {
      return sendResponse(res, 404, "No Cart Found");
    }
    let i = 0;
    let found = false;

    if (cart[0].products && cart[0].products.length > 0) {
      for (i = 0; i < cart[0].products.length; i++) {
        if (req.params.productId == cart[0].products[i].productId) {
          found = true;
          break;
        }
      }
      if (found) {
        cart[0].products.splice(i, 1);
        const newCart = new Cart(cart[0]);
        await newCart.save();
        if (!newCart) {
          return sendResponse(res, 404, "Failed to Delete Try Later");
        }
      }
      return sendResponse(res, 200, "Cart has been deleted...");
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
    const cart = await Cart.findOne({ userId: { $eq: req.user.id } });
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
    const cart = await Cart.findOne({ userId: { $eq: req.params.userId } });
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
      .skip((req.headers.page - 1) * req.headers.limit);
    if (!carts) {
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
