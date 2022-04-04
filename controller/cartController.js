import Cart from "../models/Cart.js";
import router from "express";
router.Router();
import sendResponse from "../helpers/responseSender.js";
import { validateParams } from "../utils/newValidate.js";

//CREATE CART
const addCart = async (req, res) => {
  try {
    const id = req.user.id;
    const { products } = req.body;
    const newCart = new Cart(
      {
        userId: id,
        products: products
      }
    );
    await newCart.save();
    if (!newCart) {
      return sendResponse(res, 404, "Failed to add the cart");
    }
    return sendResponse(res, 200, newCart);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//UPDATE
const updateCart = async (req, res) => {
  try {
    const id = req.user.id;
    const { products } = req.body.products;
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: { $eq: id } },
      {
        //$set: req.body,
        $set: {
          products: products
        },
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
    const id = req.user.id;
    const cart = await Cart.findOneAndDelete({ userId: { $eq: id } });
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
    const id = req.user.id;
    const { productId } = req.params;
    const checkResult = validateParams(productId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    let cart = await Cart.findOne({ userId: { $eq: id } });
    if (!cart) {
      return sendResponse(res, 404, "No Cart Found");
    }
    let i = 0;
    let found = false;

    if (cart.products && cart.products.length > 0) {
      for (i = 0; i < cart.products.length; i++) {
        if (productId == cart.products[i].productId) {
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
    const id = req.user.id;
    const cart = await Cart.findOne({ userId: { $eq: id } }).
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
    const { userId } = req.params;
    const checkResult = validateParams(userId);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    const cart = await Cart.findOne({ userId: { $eq: userId } }).
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
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined ||page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");      
    }

    const carts = await Cart.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
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
