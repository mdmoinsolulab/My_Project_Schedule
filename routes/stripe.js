const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const dotenv = require('dotenv');
dotenv.config();
const emailSender = require('../helpers/emailSender');

router.post("/payment", (req, res) => {
  const { tokenId, amount, email } = req.body;
  stripe.charges.create(
    {
      source: tokenId,
      amount: amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {

        emailSender(email);

        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
