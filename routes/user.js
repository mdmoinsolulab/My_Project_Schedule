import express from 'express';
const router =  express.Router();
import {updateUser, updateUserForAdmin, deleteUser, deleteUserForAdmin, getUser, getUserForAdmin, getAllUsers, getUsersStats} from '../controller/userController.js';
import validate from '../utils/newValidate.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} from '../utils/verifyToken.js';

router.put('/updateUser', validate , verifyTokenAndAuthorization, updateUser);
router.put('/admin/updateUser/:userId', validate , verifyTokenAndAdmin, updateUserForAdmin);
router.delete('/deleteUser', verifyTokenAndAuthorization, deleteUser);
router.delete('/admin/deleteUser/:userId', verifyTokenAndAdmin, deleteUserForAdmin);
router.get('/getUser', verifyTokenAndAuthorization, getUser);
router.get('/admin/getUser/:userId', verifyTokenAndAdmin, getUserForAdmin);
router.get('/admin/getAllUsers', verifyTokenAndAdmin, getAllUsers);
router.get('/admin/getUsersStats', verifyTokenAndAdmin, getUsersStats);

export default router;
