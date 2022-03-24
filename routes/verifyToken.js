import jwt from 'jsonwebtoken';
import sendResponse from '../helpers/responseSender.js';
import passwordCompare from '../utils/passwordCompare.js';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
      if (err) {
        sendResponse(res, 403, "Token is not valid!");
      }
      //req.user = user;
      // const checkuser = await User.findOne(
      //   {
      //      username: user.username
      //   }
      //  );
      //  if (!checkuser) {
      //    return sendResponse(res, 401, "User Not Found");
      //  }
   
      //  if (!passwordCompare(checkuser.password, user.password)) {
      //    return sendResponse(res, 401, "Wrong Password");
      //  }

      //  if (user.isDeleted == true) {
      //   return sendResponse(res, 401, "User Have Been Already Deleted");
      //  }

       req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('this is the tokens data:',req.user);
    console.log('isadmin and vendor check:',req.user.isAdmin, req.user.isVendor);
    next()
    // if (req.user.id === req.params.id || req.user.isAdmin) {
    //   if (req.user.id === req.body.id || req.user.isAdmin) {
    //   next();
    // } else {
    //   sendResponse(res, 403, "You are not alowed to do that!");
    // }
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
  console.log('in vendor')
  console.log('this is the tokens data:',req.user);
  console.log('isadmin and vendor check:',req.user.isAdmin, req.user.isVendor);
    if (req.user.isVendor) {
      next();
    } else {
      sendResponse(res, 403, "You are not alowed to do that!");
    }
  });
};

export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndVendor,
};
