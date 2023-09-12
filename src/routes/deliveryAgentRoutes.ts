import express from 'express';
import {
  loginDeliveryAgent,
  addEntryDeliveryAgent,
  markDeliveredByDeliveryAgent,
  signupDeliveryAgent,
  deleteDeliveryAgent
} from '../controller/deliveryAgentController'; 
import { validateJoiSchema } from '../middlewares/joivalidation';
import {
  signupSchema,
  loginSchema,
  addEntrySchema ,
  markDeliveredSchema,
  
} from '../controller/deliveryAgentController';
// import Joi from 'joi';

import {authorizeDeliveryAgentToken} from '../middlewares/generatetoken';

const router = express.Router();


// const signupSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
  
// });
// const loginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });

// const addEntrySchema = Joi.object({
//   _id: Joi.string().required(),
// });

// const markDeliveredSchema = Joi.object({
//     _id: Joi.string().required(),
// });

// const deleteEntrySchema = Joi.object({
//   _id: Joi.string().required(),
// });

//Route for delivery agent signup
router.post('/signup',validateJoiSchema(signupSchema),signupDeliveryAgent);
// Route for delivery agent login
router.post('/login', validateJoiSchema(loginSchema),loginDeliveryAgent);

// Route to add courier entry through courier _id
router.post('/add-entry', validateJoiSchema(addEntrySchema),addEntryDeliveryAgent);

// Route to mark courier as delivered by delivery agent
router.post('/mark-delivered', validateJoiSchema(markDeliveredSchema),markDeliveredByDeliveryAgent);

// Route to delete delivery agent
router.delete('/delete/:deliveryAgentId',authorizeDeliveryAgentToken, deleteDeliveryAgent);

export default router;
