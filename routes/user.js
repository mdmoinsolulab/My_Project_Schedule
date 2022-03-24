import express from 'express';
const router =  express.Router();
import {updateUser, updateUserForAdmin, deleteUser, deleteUserForAdmin, getUser, getUserForAdmin, getAllUsers, getUsersStats} from '../controller/userController.js';
import Validate from '../helpers/validation.js';
import Enum from '../helpers/enumtypes.js';
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
} from './verifyToken.js';

router.put('/updateUser', Validate(Enum.UPDATEUSER) , verifyTokenAndAuthorization, updateUser);
router.put('/admin/updateUser/:userId', Validate(Enum.UPDATEUSER) , verifyTokenAndAdmin, updateUserForAdmin);
router.delete('/deleteUser', Validate(Enum.UNAMEPASS), verifyTokenAndAuthorization, deleteUser);
router.delete('/admin/deleteUser/:userId', Validate(Enum.UNAMEPASS), verifyTokenAndAdmin, deleteUserForAdmin);
router.get('/getUser', Validate(Enum.UNAMEPASS), verifyTokenAndAuthorization, getUser);
router.get('/admin/getUser/:userId', Validate(Enum.UNAMEPASS), verifyTokenAndAdmin, getUserForAdmin);
router.get('/admin/getAllUsers', Validate(Enum.UNAMEPASS), verifyTokenAndAdmin, getAllUsers);
router.get('/admin/getUsersStats', Validate(Enum.UNAMEPASS), verifyTokenAndAdmin, getUsersStats);

export default router;
