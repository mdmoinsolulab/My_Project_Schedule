const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const { Validate } = require('../helpers/validation');
const {Enum} = require('../helpers/enumtypes');
const router = require("express").Router();
const CryptoJS = require("crypto-js");

//UPDATE
router.put("/:id",Validate(Enum.UPDATEUSER) , verifyTokenAndAuthorization, async (req, res) => {
  const { password, id } = req.body;
  if (password) {
    password = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      {_id : {$eq: id} , isDeleted : {$eq: false}},
      {
        $set: req.body,
      },
      { new: true }
    );
    if (updatedUser === null) {
      res.json("User Has Been already Deleted");
    }
    else {
    res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.params.id){
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isDeleted: true
        },
      },
      { new: true }
    )
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
}});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  if (req.params.id){
  try {
    const user = await User.findOne({_id : {$eq: req.params.id}, isDeleted: {$eq: false}});
    if (user.isDeleted === true) {
      res.json("User Has Been Deleted");
    }
    else {
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    }
  } catch (err) {
    res.status(500).json(err);
  }
}});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find({ isDeleted: {$eq: false} }).sort({ _id: -1 }).limit(5)
      : await User.find({ isDeleted: {$eq: true} });
      console.log(users)
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear }, isDeleted: {$eq: false} } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
