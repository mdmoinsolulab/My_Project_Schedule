const Product = require("../models/Product");
const {
  verifyTokenAndVendor,
} = require("./verifyToken");
const router = require("express").Router();
const {Enum} = require('../helpers/enumtypes');
const {Validate} = require('../helpers/validation');
const { sendResponse } = require('../helpers/responseSender');

//CREATE

router.post("/addProduct", Validate(Enum.ADDPRODUCT), verifyTokenAndVendor, async (req, res) => {

  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    sendResponse(res, 200, savedProduct);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//UPDATE
router.put("/updateProduct/:id", Validate(Enum.UPDATEPRODUCT) , verifyTokenAndVendor, async (req, res) => {
  if (req.params.id){
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    sendResponse(res, 200, updatedProduct);
  } catch (err) {
    sendResponse(res, 500, err);
  }
}});

//DELETE
router.delete("/deleteProduct/:id", verifyTokenAndVendor, async (req, res) => {
  if(req.params.id) {
  try {
    await Product.findByIdAndDelete(
      req.params.id,
    )
    sendResponse(res, 200, "Product has been deleted...");
  } catch (err) {
    sendResponse(res, 500, err);
  }
}});

//GET PRODUCT
router.get("/getProduct/:id", async (req, res) => {
  if (req.params.id) {
  try {
    const product = await Product.findOne({_id : {$eq: req.params.id}});
    if (product.isDeleted === true) {
      sendResponse(res, 404, "Product Has Been Deleted");
    }
    else {
      sendResponse(res, 200, product);
    }
  } catch (err) {
    sendResponse(res, 500, err);
  }
}});

//GET ALL PRODUCTS
router.get("/getAllProducts", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find({ isDeleted: {$eq: false}}).sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        isDeleted: {$eq: false},
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    sendResponse(res, 200, products);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

module.exports = router;
