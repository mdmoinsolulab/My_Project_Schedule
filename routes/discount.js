const Discount = require("../models/Discount");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");


const router = require("express").Router();

//CREATE
router.post("/add/:id", verifyTokenAndAdmin, async (req, res) => {
    const newDiscount = new Discount(req.body);   
    try {
        
      const savedDiscount = await newDiscount.save();
      res.status(200).json(savedDiscount);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//GET ALL
router.get("/get/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const discounts = await Discount.find({ productId: req.params.id });
        res.status(200).json(discounts);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;
