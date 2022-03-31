import mongoose from "mongoose";

const validationHelper = (fcaller, element, start, end) => {

const required = (element) => {
  if (element === "" || element == null || element === undefined){
     return true;
  }
};
const isEmptyOrNull = (element) => {
  if (element === "" || element == null){
     return true;
  }
};

const validID = (id) => {
  var ObjectId = mongoose.Types.ObjectId;
  if (!ObjectId.isValid(id)) return true;
};

const isString = (element) => {
  var letters = /^[A-Za-z]+$/;
  let checkType = typeof element;
  if (checkType != 'string' || !element.match(letters)) return true;
};

const isNumber = (element) => {
  var letters = /^[0-9]+$/;
  if (!element.toString().match(letters)) {
    return true
  }
};

const isValidEmail = (element) => {
  // let email =
  //   /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  let email = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
  if (!email.test(element)) {
    return true;
  }
};

const isStrongPassword = (element) => {
  let password =
    /^^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/;
  if (!password.test(element)) {
    return true;
  }
};

const isValidPhoneNumber = (element) => {
  var letters = /^[6-9]{1}[0-9]{9}$/;
  if (!element.toString().match(letters)) return true;
};

const isBetweenNumber = (element, start, end) => {
    if (Number(element) < start || Number(element) > end) return true;
};

if (fcaller === 'required') {
  return required(element);
}
if (fcaller === 'isEmptyOrNull') {
  return isEmptyOrNull(element);
}
if (fcaller === 'isString') {
  return isString(element);
}
if (fcaller === 'isNumber') {
  return isNumber(element);
}
if (fcaller === 'validID') {
  return validID(element);
}
if (fcaller === 'isValidEmail') {
  return isValidEmail(element);
}
if (fcaller === 'isStrongPassword') {
  return isStrongPassword(element);
}
if (fcaller === 'isBetweenNumber') {
  return isBetweenNumber(element, start, end);
}
if (fcaller === 'isValidPhoneNumber') {
  return isValidPhoneNumber(element);
}
}

export default validationHelper;
