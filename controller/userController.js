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
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
    //const {validationCode, ...others} = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: { $eq: id }, isDeleted: { $eq: false } },
      {
         $set: req.body,
        //$set: others,
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
    
    const checkResult = validateParams(id);
    console.log('these are the results : ', checkResult)
    if (checkResult != true) {
      return sendResponse(res, 500, checkResult);
    }

    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: { $eq: id }, isDeleted: { $eq: false } },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedUser) {
      return sendResponse(res, 404, "Failed to update the user");
    }
    return sendResponse(res, 200, "Successfully Updated The User");
  } catch (err) {
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


    // const query = req.query.new;   recent
    // const users = query  recent
    //   ? await User.find({ isDeleted: {$eq: false} }).sort({ _id: -1 }).limit(5)
    //   : await User.find({ isDeleted: {$eq: false} });
    const users = await User.find({ isDeleted: { $eq: false }, 'roles.isAdmin': {$eq: false} })
      .sort({ _id: -1 })
      .limit(req.headers.limit * 1)
      .skip((req.headers.page - 1) * req.headers.limit);

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
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear }, isDeleted: { $eq: false } } },
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
