import express from 'express';
const router =  express.Router();
import { addCart, updateCart, deleteCart, deleteCartItem, getUserCart, getUserCartForAdmin, getAllUsersCarts } from '../controller/cartController.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from './verifyToken.js';

router.post('/addCart',  verifyTokenAndAuthorization, addCart);
router.put('/updateCart', verifyTokenAndAuthorization, updateCart);
router.delete('/deleteCart', verifyTokenAndAuthorization, deleteCart);
router.delete('/deleteCartItem/:productId', verifyTokenAndAuthorization, deleteCartItem);
router.get('/getUserCart', verifyTokenAndAuthorization, getUserCart);
router.get('/admin/getUserCart/:userId', verifyTokenAndAdmin, getUserCartForAdmin);
router.get('/admin/getAllUsersCarts', verifyTokenAndAdmin, getAllUsersCarts);

export default router;
