const Product = require("../models/Product");
const {
  verifyTokenAndVendor,
} = require("./verifyToken");
const router = require("express").Router();
const {Enum} = require('../helpers/enumtypes');
const {Validate} = require('../helpers/validation');

//CREATE

router.post("/", Validate(Enum.ADDPRODUCT), verifyTokenAndVendor, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", Validate(Enum.UPDATEPRODUCT) , verifyTokenAndVendor, async (req, res) => {
  if (req.params.id){
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
}});

//DELETE
router.delete("/:id", verifyTokenAndVendor, async (req, res) => {
  if(req.params.id) {
  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isDeleted: true
        },
      },
      { new: true }
    )
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
}});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  if (req.params.id) {
  try {
    const product = await Product.findOne({_id : {$eq: req.params.id}, isDeleted: {$eq: false}});
    if (product.isDeleted === true) {
      res.json("Product Has Been Deleted");
    }
    else {
    res.status(200).json(product);
    }
  } catch (err) {
    res.status(500).json(err);
  }
}});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
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

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
