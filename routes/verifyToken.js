const jwt = require("jsonwebtoken");
const { sendResponse } = require('../helpers/responseSender');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        sendResponse(res, 403, "Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      sendResponse(res, 403, "You are not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      sendResponse(res, 403, "You are not alowed to do that!");
    }
  });
};

const verifyTokenAndVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isVendor) {
      next();
    } else {
      sendResponse(res, 403, "You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndVendor,
};
