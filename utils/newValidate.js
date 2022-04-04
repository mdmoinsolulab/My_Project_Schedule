import validationHelper from "./newValidationHelper.js";
import sendResponse from "../helpers/responseSender.js";
import Enum from "./enumtypes.js";

const validate = (req, res, next) => {
  const { validationCode } = req.body;
  let errorsFound = {
    'Errors': [],
    'Warnings': []
  };


  if (validationCode === "register") {
    const { username, email, password } = req.body;

    validateTwoConditions(username, 'username', 'required', 'isString');

    validateTwoConditions(email, 'email', 'required', 'isValidEmail')

    validateTwoConditions(password, 'password','required', 'isStrongPassword')

    if (Object.keys(errorsFound.Errors).length > 0 && errorsFound.constructor === Object){
      return sendResponse(res, 401, errorsFound);
    }

    next();
  }

  if (validationCode === "login") {
    const { username, email, password } = req.body;

    validateTwoConditions(username, 'username', 'required', 'isString');

    validateTwoConditions(password, 'password', 'required', 'isStrongPassword');

    if (Object.keys(errorsFound.Errors).length > 0 && errorsFound.constructor === Object){
      return sendResponse(res, 401, errorsFound);
    }

    next();
  }

  if (validationCode === "updateUser") {
    const { username, email, password, roles, isDeleted } = req.body;
    if (roles != undefined || isDeleted != undefined) {
      return sendResponse(res, 401, "You are not allowed to update certain properties");
    }

    if (username !== undefined) {
      validateTwoConditions(username, 'username', 'isEmptyOrNull', 'isString')
    }

    if (email !== undefined) {
      validateTwoConditions(email, 'email', 'isEmptyOrNull', 'isValidEmail')
    }

    if (password !== undefined) {
      validateTwoConditions(password, 'password', 'isEmptyOrNull', 'isStrongPassword')
    }

    if (Object.keys(errorsFound.Errors).length > 0 && errorsFound.constructor === Object) {
      return sendResponse(res, 401, errorsFound);
    }

    next();
  }


  // Product
  if (validationCode === "addProduct") {
    const { title, desc, img, categories, price, discount, size } = req.body;

    validateTwoConditions(title, 'title', 'required', 'isString')

    validateTwoConditions(desc, 'desc', 'required', 'isString')

    validateTwoConditions(img, 'img', 'required', 'isString');

    if (categories != undefined) {
    if (!validationHelper('isEmptyOrNull', categories) && Array.isArray(categories) && categories.length > 0) {
      categories.forEach(innerEle => {
        if (validationHelper('isString', innerEle)) {
          errorsFound.Warnings.push({'categories': Enum.INVALID_DATA});
        }
      })
    } else {
      errorsFound.Warnings.push({'categories': returnUndefined("element")});
    }
    }
    if (discount != undefined) {
    if (!validationHelper('isEmptyOrNull', discount) && Array.isArray(discount) && discount.length > 0) {
      discount.forEach(innerEle => {
        if (validationHelper('isNumber', innerEle)) {
          errorsFound.Warnings.push({'discount': Enum.INVALID_DATA});
        }
      })
    } else {
      errorsFound.Warnings.push({'discount': returnUndefined("element")});
    }
    }
  
    validateTwoConditions(price, 'price', 'required', 'isNumber');

    validateTwoConditions(size, 'size', 'required', 'isString', 1);
    
    if ((Object.keys(errorsFound.Errors).length > 0 || Object.keys(errorsFound.Warnings).length > 0) && errorsFound.constructor === Object) {
      return sendResponse(res, 401, errorsFound);
    }

    next();
  }

  if (validationCode === "updateProduct") {
    const { title, desc, img, price, categories, size, color, discount  } = req.body;

    if (title !== undefined) {
      validateTwoConditions(title, 'title', 'isEmptyOrNull', 'isString');
    }

    if (desc !== undefined) {
      validateTwoConditions(desc, 'desc', 'isEmptyOrNull', 'isString');
    }

    if (img !== undefined) {
      validateTwoConditions(img, 'img', 'isEmptyOrNull', 'isString');
    }

    if (categories != undefined) {
    if (!validationHelper('isEmptyOrNull', categories) && Array.isArray(categories) && categories.length > 0) {
      categories.forEach(innerEle => {
        if (validationHelper('isString', innerEle)) {
          errorsFound.Errors.push({'categories': Enum.INVALID_DATA});
        }
      })
    } else {
      errorsFound.Errors.push({'categories': returnUndefined("element")});
    }
    }

    if (discount != undefined) {
    if (!validationHelper('isEmptyOrNull', discount) && Array.isArray(discount) && discount.length > 0) {
      discount.forEach(innerEle => {
        if (validationHelper('isNumber', innerEle)) {
          errorsFound.Errors.push({'discount': Enum.INVALID_DATA});
        }
      })
    } else {
      errorsFound.Errors.push({'discount': returnUndefined("element")});
    }
    }

    if (price !== undefined) {
      validateTwoConditions(price, 'price', 'isEmptyOrNull', 'isNumber');
    }

    if (size !== undefined) {
      validateTwoConditions(size, 'size', 'isEmptyOrNull', 'isString');
    }

    if (color !== undefined) {
      validateTwoConditions(color, 'color', 'isEmptyOrNull', 'isString');
    }

    if ((Object.keys(errorsFound.Errors).length > 0 || Object.keys(errorsFound.Warnings).length > 0) && errorsFound.constructor === Object) {
      return sendResponse(res, 401, errorsFound);
    }

    return next();
  }

  if (validationCode === "updateDiscount") {
    const { discount  } = req.body;

    if (discount != undefined) {
      if (!validationHelper('isEmptyOrNull', discount) && Array.isArray(discount) && discount.length > 0) {
        discount.forEach(innerEle => {
          if (validationHelper('isNumber', innerEle)) {
            //console.log('how many iterations')
            errorsFound.Errors.push({'discount': Enum.INVALID_DATA});
          }
        })
      } else {
        errorsFound.Errors.push({'discount': returnUndefined("element")});
      }
      } else {
        errorsFound.Errors.push({'discount': returnUndefined("element")});
      }
      //console.log('got continued');
      if ((Object.keys(errorsFound.Errors).length > 0 || Object.keys(errorsFound.Warnings).length > 0) && errorsFound.constructor === Object) {
        return sendResponse(res, 401, errorsFound);
      }

      return next();
  }

  if (validationCode === "addCart" || validationCode === "updateCart") {
    const { products } = req.body;
    const checkProperties = ['productId', 'quantity'];
    const checkPropertiesValues = ['required validID', 'required isNumber']
    let checkIfFailed = false;

    if (products !== undefined && Array.isArray(products)) {
      for (let i=0; i<products.length; i++) {
        if (checkIfFailed == false) {
        if (Object.keys(products[i]).length === 2) {
          for (let j=0; j<2; j++) {
            if (products[i][`${checkProperties[j]}`] != undefined) {
              const methods = checkPropertiesValues[j].split(" ");
              if (!validateTwoConditions(products[i][`${checkProperties[j]}`], `Inside product on position ${i+1} Array's ${j+1} Property ${checkProperties[j]}`, methods[0], methods[1])) {
                checkIfFailed = true;
                break;
              }
            } else {
                checkIfFailed = true;
                break;
            }
          }
        } else {
          checkIfFailed = true;
          break;
        }
      }}
    } else {
      return sendResponse(res, 401, 'nothing to add');
    }

    if (checkIfFailed) {
      return sendResponse(res, 401, errorsFound);
    }

    return next();
  }

  if (validationCode === "addOrder" || validationCode === "updateOrder") {
    const { products } = req.body;
    const checkProperties = ['productId', 'quantity', 'productAmount'];
    const checkPropertiesValues = ['required validID', 'required isNumber', 'required isNumber']
    let checkIfFailed = false;

    if (products !== undefined && Array.isArray(products)) {
      for (let i=0; i<products.length; i++) {
        if (checkIfFailed == false) {
        if (Object.keys(products[i]).length === 3) {
          for (let j=0; j<3; j++) {
            if (products[i][`${checkProperties[j]}`] != undefined) {
              const methods = checkPropertiesValues[j].split(" ");
              if (!validateTwoConditions(products[i][`${checkProperties[j]}`], `Inside product on position ${i+1} Array's ${j+1} Property ${checkProperties[j]}`, methods[0], methods[1])) {
                checkIfFailed = true;
                return sendResponse(res, 401, errorsFound);
              }
            } else {
                checkIfFailed = true;
                return sendResponse(res, 401, 'required property not found');
            }
          }
        } else {
          checkIfFailed = true;
          return sendResponse(res, 401, 'invalid number of properties');
        }
      }}
    } else {
      return sendResponse(res, 401, 'nothing to add');
    }

    return next();
  }

    function validateTwoConditions(element, elementString, firstValidation, secondValidation, warning = 0) {
        let errorsPlacer;
        if (warning) {
          errorsPlacer = errorsFound.Warnings;
        } else {
          errorsPlacer = errorsFound.Errors
        }      
        
        if (validationHelper(firstValidation, element) !== true) {
        if (validationHelper(secondValidation, element) !== true) {
          return true;
        } else {
          errorsPlacer.push({[elementString]: Enum.INVALID_DATA});
        }
      } else {
        errorsPlacer.push({[elementString]: returnUndefined("element")});
      }
    };


  function returnUndefined(input) {
    return `${input} is undefined, empty or null`;
  };
};

export function validateParams(passedId) {
        if (!validationHelper('validID', passedId)) {
            return true;
        } else {
          return "invalid parameter";
        }      
}

export default validate;
