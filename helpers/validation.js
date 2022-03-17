const { sendResponse } = require('./responseSender');
const {Enum} = require('./enumtypes');
let isFailed = false;

function Validate(type){
  return function (req,res,next) {

    if (type === Enum.LOGIN) {
        checkForLogin(req, res);
    }
    if (type === Enum.REGISTERATION) {
        checkForRegisteration(req, res)
    }
    if (type === Enum.UPDATEUSER) {
        checkForSomeUserValue(req, res);
    }
    if (type === Enum.ADDPRODUCT) {
        checkForProduct(req, res);
    }
    if (type === Enum.UPDATEPRODUCT) {
        checkForSomeProductValue(req, res);
    }
    if (isFailed === false){
    next()
    }
  }   
}

function checkForLogin(req, res) {
    const { username, password } = req.body;
    if (username && username.length < 3) {
    isFailed = true;
    sendResponse(res, 401, "Please enter valid name")
    }
    else if (password && password.length < 3) {
    isFailed = true;
    sendResponse(res, 401, "Please enter valid password")
    }
}

function checkForRegisteration(req, res) {
    const { email } = req.body;
    checkForLogin(req, res);
    if (ValidateEmail(email) === false) {
        isFailed = true;
        sendResponse(res, 401, "Please enter valid email")
    }
}

function checkForSomeUserValue(req, res) {
    const { username, password, email, isVendor } = req.body;
    isFailed = true;
    if (username && username.length > 3) {
        isFailed = false;
        }
    else if (password && password.length > 3) {
        isFailed = false;
        }
    else if (ValidateEmail(email) === true) {
            isFailed = false;            
        }
    else if (isVendor) {
        isFailed = false;
    }
    else {
        sendResponse(res, 401, "Please enter some valid details")
    }
}

function checkForProduct (req, res) {
    const { title, desc, img, price } = req.body;

    if (title && title.length < 1) {
    isFailed = true;
    sendResponse(res, 401, "Please enter valid title")
    }
    else if (desc && desc.length < 1) {
    isFailed = true;
    sendResponse(res, 401, "Please enter valid desc")
    }
    else if (img && img.length < 3) {
    isFailed = true;
    sendResponse(res, 401, "Please enter valid image")
    }
    else if (price && price.length < 1) {
    isFailed = true;
    sendResponse(res, 401, "Please enter valid price")
    }
}

function checkForSomeProductValue (req, res) {
    const { title, desc, img, price, categories, size, color } = req.body;
    isFailed = true;
    if (title && title.length > 0) {
    isFailed = false;
    }
    else if (desc && desc.length > 0) {
    isFailed = false;
    }
    else if (img && img.length > 2) {
    isFailed = false;
    }
    else if (price && price.length > 0) {
    isFailed = false;
    }
    else if (categories && categories.length > 0) {
    isFailed = false;
    }
    else if (price && price.size > 0) {
    isFailed = false;
    }
    else if (price && price.color > 0) {
    isFailed = false;
    }
    else {
    sendResponse(res, 401, "Please enter some valid details")
    }
}

function ValidateEmail(mail) 
{
 if (mail === undefined) {
    return false;
 }
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}

module.exports = { Validate };