const sendResponse = (res, status, message) => {    
     return res.status(status).json(message);
}

export default sendResponse;
