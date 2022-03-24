import express from 'express';
const router =  express.Router();
import { addOrder, updateOrder, updateOrderForAdmin, deleteOrder, deleteOrderForAdmin, getOrders, getOrdersForAdmin, getAllOrders, getIncome } from '../controller/orderController.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from './verifyToken.js';

router.post('/addOrder',  verifyTokenAndAuthorization, addOrder);
router.put('/updateOrder/:orderId', verifyTokenAndAuthorization, updateOrder);
router.put('/admin/updateOrder/:userId/:orderId', verifyTokenAndAuthorization, updateOrderForAdmin);
router.delete('/deleteOrder/:orderId', verifyTokenAndAuthorization, deleteOrder);
router.delete('/admin/deleteOrder/:userId/:orderId', verifyTokenAndAuthorization, deleteOrderForAdmin);
router.get('/getOrders', verifyTokenAndAuthorization, getOrders);
router.get('/admin/getOrders/:userId', verifyTokenAndAuthorization, getOrdersForAdmin);
router.get('/admin/getAllOrders', verifyTokenAndAdmin, getAllOrders);
router.get('/admin/getincome', verifyTokenAndAdmin, getIncome);

export default router;
