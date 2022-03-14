const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        
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
  to: req.body.email,
  subject: 'Sending email using Nodejs',
  html: `<h1>Message From Node</h1><p>Hi I Have Sent You This Message Yolo!</p>`
};

transporter.sendMail(mailOptions, function(err, info) {
  if (err) {
      res.json("Email Not Sent Please Check Your Email Later");
  } else {
      res.status(200).json('Email sent to: ' + req.body.email, stripeRes);
  }
});
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
