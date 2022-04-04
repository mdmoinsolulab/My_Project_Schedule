import User from "../models/User.js";
import router from "express";
router.Router();
import CryptoJS from "crypto-js";
import sendResponse from "../helpers/responseSender.js";
import { validateParams } from "../utils/newValidate.js";

//UPDATE
const updateUser = async (req, res) => {
  try {
    let id = req.user.id;
    const {username, email, password} = req.body;
    if (password) {
      password = CryptoJS.AES.encrypt(
        password,
        process.env.PASS_SEC
      ).toString();
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: { $eq: id }, isDeleted: { $eq: false } },
      {
         //$set: req.body,
        //$set: others,
        $set: {
          username: username,
          email: email,
          password: password
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return sendResponse(res, 404, "Failed to update the user");
    }
    return sendResponse(res, 200, "Successfully Updated The User");
  } catch (err) {
    if (err.name == 'MongoServerError') {
      Object.values(err.keyValue).forEach(e => {
      sendResponse(res, 500, `${e} already exists`)})
      return
    }
    return sendResponse(res, 500, err);
  }
};

//UPDATE FOR ADMIN
const updateUserForAdmin = async (req, res, next) => {
  try {
    let id = req.params.userId;
    const {username, email, password} = req.body;
    
    const checkResult = validateParams(id);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }

    if (password) {
      password = CryptoJS.AES.encrypt(
        password,
        process.env.PASS_SEC
      ).toString();
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: { $eq: id }, isDeleted: { $eq: false }, "roles.isAdmin": {$eq: false} },
      {
        //$set: req.body,
        $set: {
          username: username,
          email: email,
          password: password
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return sendResponse(res, 404, "Failed to update the user");
    }
    return sendResponse(res, 200, "Successfully Updated The User");
  } catch (err) {
    if (err.name == 'MongoServerError') {
      Object.values(err.keyValue).forEach(e => {
      sendResponse(res, 500, `${e} already exists`)})
      return
    }
    return sendResponse(res, 500, err);
  }
};

//DELETE
const deleteUser = async (req, res) => {
  try {
    let id = req.user.id;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
    if (!user) {
      return sendResponse(res, 404, "Failed to delete the user");
    }
    return sendResponse(res, 200, "User has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//DELETE
const deleteUserForAdmin = async (req, res) => {
  try {
    let id = req.params.userId;
    const checkResult = validateParams(id);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
        },
      },
      { new: true }
    );
    if (!user) {
      return sendResponse(res, 404, "Failed to delete the user");
    }

    return sendResponse(res, 200, "User has been deleted...");
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER
const getUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findOne({
      _id: { $eq: id },
      isDeleted: { $eq: false },
    });

    if (!user) {
      return sendResponse(res, 401, "User Not Found");
    }

    const { password, ...others } = user._doc;
    return sendResponse(res, 200, others);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER FOR ADMIN
const getUserForAdmin = async (req, res) => {
  try {
    const id = req.params.userId;
    const checkResult = validateParams(id);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }
    const user = await User.findOne({
      _id: { $eq: id },
      isDeleted: { $eq: false },
      'roles.isAdmin': {$eq: false}
    });

    if (!user) {
      return sendResponse(res, 401, "User Not Found");
    }

    return sendResponse(res, 200, user);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET ALL USER
const getAllUsers = async (req, res) => {
  try {
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      return sendResponse(res, 404, "Page doesn't exists");
    }

    const users = await User.find({ isDeleted: { $eq: false }, 'roles.isAdmin': {$eq: false} })
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    if (!users) {
      return sendResponse(res, 401, "No User Found");
    }

    return sendResponse(res, 200, users);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//GET USER STATS
const getUsersStats = async (req, res) => {
  try {
    const {page, limit} = req.query;
    console.log("this is page and limit : ", page, ' : ', limit);
    if (page === undefined || limit === undefined || page < 1 || limit < 1) {
      
      return sendResponse(res, 404, "Page doesn't exists");
      
    }

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear }, isDeleted: { $eq: false }, "roles.isAdmin": {$eq: false} } },
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
      { $limit : (limit * 1) },
      { $skip: (page * limit - limit)}
    ]);
    if (!data) {
      return sendResponse(res, 401, "Nothing Found");
    }
    return sendResponse(res, 200, data);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

export {
  updateUser,
  updateUserForAdmin,
  deleteUser,
  deleteUserForAdmin,
  getUser,
  getUserForAdmin,
  getAllUsers,
  getUsersStats,
};
