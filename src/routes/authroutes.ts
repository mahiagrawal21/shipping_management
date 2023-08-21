
const express = require('express')
const route = express.Router()
const DepartmentController = require('../controllers/departmentController')
const CourierController = require('../controllers/courierController')
const DeliveryAgentController = require('../controllers/deliveryAgentController')

const {
    authorize,
    authorizeDeliveryAgent,
  } = require('../middleware/authorizationMiddleware')
  

route.get('/', (req, res) => {
    res.send('/api working')
  })
  


//------------------ DEPARTMENT APIS -------------------------------//
route.post('/departments/addDepartment', DepartmentController.addDepartment)
route.post('/departments/loginDepartment', DepartmentController.loginDepartment)
route.get(
  '/departments/getDepartmentInfo',
  authorize,
  DepartmentController.getDepartmentProfile
)
route.patch(
  '/departments/updateDepartmentInfo',
  authorize,
  DepartmentController.updateDepartmentProfile
)



















// import express, { Request, Response } from 'express';
// // import {  } from '../controller/usercontroller';

// const router = express.Router();

// // Login route
// router.post('/login', async (req: Request, res: Response) => {
//   try {
//     await login(req, res);
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Signup route
// router.post('/signup', async (req: Request, res: Response) => {
//   try {
//     await signup(req, res);
//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// export default router;

