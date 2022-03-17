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
const { sendResponse } = require('../helpers/responseSender');

//UPDATE
router.put("/updateUser/:id",Validate(Enum.UPDATEUSER) , verifyTokenAndAuthorization, async (req, res) => {
  console.log('triggered');
  let { password } = req.body;
  let id = req.params.id;
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
      sendResponse(res, 404, "User Has Been already Deleted");
    }
    else {
      sendResponse(res, 200, updatedUser);
    }
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//DELETE
router.delete("/deleteUser/:id", verifyTokenAndAuthorization, async (req, res) => {
  let id = req.params.id;
  if (id){
  try {
    await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true
        },
      },
      { new: true }
    )
    sendResponse(res, 200, "User has been deleted...");
  } catch (err) {
    sendResponse(res, 500, err);
  }
}});

//GET USER
router.get("/getUser/:id", verifyTokenAndAdmin, async (req, res) => {
  if (req.params.id){
  try {
    const user = await User.findOne({_id : {$eq: req.params.id}});
    console.log('this is the user  :  ', user)
    if (user.isDeleted === true) {
      sendResponse(res, 404, "User Has Been Deleted");
    }
    else {
    const { password, ...others } = user._doc;
    sendResponse(res, 200, others);
    }
  } catch (err) {
    sendResponse(res, 500, err);
  }
}});

//GET ALL USER
router.get("/getAllUsers", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find({ isDeleted: {$eq: false} }).sort({ _id: -1 }).limit(5)
      : await User.find({ isDeleted: {$eq: false} });
      console.log(users)
      sendResponse(res, 200, users);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

//GET USER STATS
router.get("/getUsersStats", verifyTokenAndAdmin, async (req, res) => {
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
    sendResponse(res, 200, data);
  } catch (err) {
    sendResponse(res, 500, err);
  }
});

module.exports = router;
