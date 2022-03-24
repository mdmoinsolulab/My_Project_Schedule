import router from "express";
router.Router()
import stripe from 'stripe';
stripe(process.env.STRIPE_KEY);
import dotenv from 'dotenv';
dotenv.config();
import emailSender from '../helpers/emailSender.js';
import sendResponse from '../helpers/responseSender.js';

const makePayment = (req, res) => {
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
};

export { makePayment };
