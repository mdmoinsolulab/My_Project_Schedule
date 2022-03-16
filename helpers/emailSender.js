
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

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
        res.json("Email Not Sent Please Check Your Email Later");
    } else {
        res.status(200).json('Email sent to: ' + email, stripeRes);
    }
  });
}

module.exports = { emailSender };