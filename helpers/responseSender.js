function sendResponse(res, status, message) {    
      res.status(status).json(message);
}

module.exports = { sendResponse };