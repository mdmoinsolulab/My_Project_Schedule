import express from 'express';
const router =  express.Router();
import { makePayment } from '../controller/stripeController.js';

router.post('/makePayment', makePayment);

export default router;
