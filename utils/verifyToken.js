import jwt from 'jsonwebtoken';
import sendResponse from '../helpers/responseSender.js';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
      if (err) {
        return sendResponse(res, 403, "Token is not valid!");
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
    return next()
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      return next();
    } else {
      return sendResponse(res, 403, "You are not alowed to do that!");
    }
  });
};

const verifyTokenAndVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isVendor) {
      return next();
    } else {
      return sendResponse(res, 403, "You are not alowed to do that!");
    }
  });
};

export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndVendor,
};
