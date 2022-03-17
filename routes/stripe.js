const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const dotenv = require('dotenv');
dotenv.config();
const emailSender = require('../helpers/emailSender');
const { sendResponse } = require('../helpers/responseSender');

router.post("/makePayment", (req, res) => {
  const { tokenId, amount, email } = req.body;
  stripe.charges.create(
    {
      source: tokenId,
      amount: amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        sendResponse(res, 500, stripeErr);
      } else {

        emailSender(email);

        sendResponse(res, 200, stripeRes);
      }
    }
  );
});

module.exports = router;
