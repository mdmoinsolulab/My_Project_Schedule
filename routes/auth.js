import express from 'express';
const router =  express.Router();
import { register, login } from '../controller/authController.js'
import Validate from '../helpers/validation.js';
import Enum from '../helpers/enumtypes.js';

router.post('/register', Validate(Enum.REGISTERATION), register);
router.post('/login', Validate(Enum.LOGIN), login)

export default router;
