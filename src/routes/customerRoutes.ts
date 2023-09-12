

import express from 'express';
//import { authenticateToken } from '../middlewares/generatetoken';
import { getCustomers, signup, LoginUser, forgotPassword,verifyAndRegisterUser } from '../controller/customerController';

const router = express.Router();

// GET /api/customers
router.get('/customers', getCustomers);

// POST /api/signup
router.post('/signup', signup);

// POST /api/login
router.post('/login', LoginUser.user_login);

//POST/api/logout
router.post('/logout', LoginUser.user_logout);

// POST /api/forgot-password
router.post('/forgot-password', forgotPassword.forgot_password);

// POST /api/reset-password
router.post('/reset-password', forgotPassword.reset_password);

//POST /api/verifyAndRegisterUser
router.post('/verify-and-register-user',verifyAndRegisterUser)

export default router;


