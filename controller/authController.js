import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import sendResponse from "../helpers/responseSender.js";
import passwordCompare from "../utils/passwordCompare.js";

//REGISTER
const register = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    const newUser = new User({
      username: username,
      email: email,
      password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
      // roles : roles  recent
      // roles : {
      //   isAdmin: roles[0].isAdmin,
      //   isVendor: roles[1].isVendor
      // }
    });
    await newUser.save();
    if (!newUser) {
      return sendResponse(res, 404, "Failed to add the product");
    }
    return sendResponse(res, 201, newUser);
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

//LOGIN
const login = async (req, res) => {
  try {
    const { username, password: userPassword } = req.body;
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      return sendResponse(res, 401, "User Not Found");
    } else if (user.isDeleted == true) {
      return sendResponse(res, 401, "User Has Been Already Deleted");
    }

    if (!passwordCompare(user.password, userPassword)) {
      return sendResponse(res, 401, "Wrong Password");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.roles.isAdmin,
        isVendor: user.roles.isVendor,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    return sendResponse(res, 200, { ...others, accessToken });
  } catch (err) {
    return sendResponse(res, 500, err);
  }
};

export { register, login };
