import express from 'express';
const router =  express.Router();
import { addOrder, updateOrder, updateOrderForAdmin, deleteOrder, deleteOrderForAdmin, getOrders, getOrdersForAdmin, getAllOrders, getIncome } from '../controller/orderController.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from '../utils/verifyToken.js';
import validate from '../utils/newValidate.js';

router.post('/addOrder', validate, verifyTokenAndAuthorization, addOrder);
router.put('/updateOrder/:orderId', validate, verifyTokenAndAuthorization, updateOrder);
router.put('/admin/updateOrder/:userId/:orderId', validate, verifyTokenAndAuthorization, updateOrderForAdmin);
router.delete('/deleteOrder/:orderId', verifyTokenAndAuthorization, deleteOrder);
router.delete('/admin/deleteOrder/:userId/:orderId', verifyTokenAndAuthorization, deleteOrderForAdmin);
router.get('/getOrders', verifyTokenAndAuthorization, getOrders);
router.get('/admin/getOrders/:userId', verifyTokenAndAuthorization, getOrdersForAdmin);
router.get('/admin/getAllOrders', verifyTokenAndAdmin, getAllOrders);
router.get('/admin/getincome', verifyTokenAndAdmin, getIncome);

export default router;
