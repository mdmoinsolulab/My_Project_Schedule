import express from 'express';
const router =  express.Router();
import { addCart, updateCart, deleteCart, deleteCartItem, getUserCart, getUserCartForAdmin, getAllUsersCarts } from '../controller/cartController.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from '../utils/verifyToken.js';
import validate from '../utils/newValidate.js';

router.post('/addCart', validate, verifyTokenAndAuthorization, addCart);
router.put('/updateCart', validate, verifyTokenAndAuthorization, updateCart);
router.delete('/deleteCart', verifyTokenAndAuthorization, deleteCart);
router.delete('/deleteCartItem/:productId', verifyTokenAndAuthorization, deleteCartItem);
router.get('/getUserCart', verifyTokenAndAuthorization, getUserCart);
router.get('/admin/getUserCart/:userId', verifyTokenAndAdmin, getUserCartForAdmin);
router.get('/admin/getAllUsersCarts', verifyTokenAndAdmin, getAllUsersCarts);

export default router;
