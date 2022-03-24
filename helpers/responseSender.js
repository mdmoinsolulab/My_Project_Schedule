const sendResponse = (res, status, message) => {    
      res.status(status).json(message);
}

export default sendResponse;
//module.exports = { sendResponse };