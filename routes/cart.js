const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const { sendResponse } = require('../helpers/responseSender');
//CREATE

router.post("/addCart/:id", verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    sendResponse(res, 200, savedCart);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//UPDATE
router.put("/updateCart/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {userId: {$eq: req.params.id}},
      {
        $set: req.body,
      },
      { new: true }
    );
    sendResponse(res, 200, updatedCart);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//DELETE
router.delete("/deleteCart/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findOneAndDelete({userId: {$eq: req.params.id}});
    sendResponse(res, 200, "Cart has been deleted...");
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//DELETE PRODUCT ITEM
router.delete("/deleteCartItem/:id/:productId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let cart = await Cart.find({ userId: {$eq: req.params.id} });
    let savedCart;
    let i = 0;
    let found = false;
    
    if (cart[0].products && cart[0].products.length > 0)
    {
    for (i=0; i<cart[0].products.length; i++) {
      if (req.params.productId == cart[0].products[i].productId) {
        found = true;
        break;
      }
    }
    if (found) {
    cart[0].products.splice(i, 1);
    const newCart = new Cart(cart[0]);
    savedCart = await newCart.save();
    }
    sendResponse(res, 200, "Cart has been deleted...");
  }
  else {
    sendResponse(res, 404, 'No Items to delete');
  }
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//GET USER CART
router.get("/getUserCart/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: {$eq: req.params.id }});
    sendResponse(res, 200, cart);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//GET ALL

router.get("/getCart", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    sendResponse(res, 200, carts);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

module.exports = router;
