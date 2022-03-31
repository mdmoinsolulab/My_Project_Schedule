import express from 'express';
const router =  express.Router();
import { register, login } from '../controller/authController.js'
import validate from '../utils/newValidate.js';

router.post('/register', validate, register);
router.post('/login', validate, login)

export default router;