
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { sendResponse } = require('./responseSender');

function emailSender(email) {
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
  };
  var transporter = nodemailer.createTransport(smtpConfig);
  
  
  let mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: email,
    subject: 'Sending email using Nodejs',
    html: `<h1>Message From Node</h1><p>Hi I Have Sent You This Message Yolo!</p>`
  };
  
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      sendResponse(res, 0, "Email Not Sent Please Check Your Email Later");
    } else {
      sendResponse(res, 200, 'Email sent to: ' + email, stripeRes);
    }
  });
}

module.exports = { emailSender };