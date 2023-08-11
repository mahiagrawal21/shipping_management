import express from "express";

const router=express.Router();

//middleware
//import {validateUser} from '../middleware/JoiValidation'

//controller
import {getCustomers} from '../controller/customerController'

//router.post('/signup',validateUser,getCustomers);

export default router;