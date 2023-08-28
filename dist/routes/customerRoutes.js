"use strict";
//import express from 'express';
// import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controller/customerController';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.get('/', getCustomers);
// router.get('/:id', getCustomerById);
// router.post('/', createCustomer);
// router.put('/:id', updateCustomer);
// router.delete('/:id', deleteCustomer);
// export default router;
const express_1 = __importDefault(require("express"));
//import { authenticateToken } from '../middlewares/generatetoken';
const customerController_1 = require("../controller/customerController");
const router = express_1.default.Router();
// GET /api/customers
router.get('/customers', customerController_1.getCustomers);
// POST /api/signup
router.post('/signup', customerController_1.signup);
// POST /api/login
router.post('/login', customerController_1.LoginUser.user_login);
//POST/api/logout
router.post('/logout', customerController_1.LoginUser.user_logout);
// POST /api/forgot-password
router.post('/forgot-password', customerController_1.forgotPassword.forgot_password);
// POST /api/reset-password
router.post('/reset-password', customerController_1.forgotPassword.reset_password);
//POST /api/verifyAndRegisterUser
router.post('/verify-and-register-user', customerController_1.verifyAndRegisterUser);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map