
import express from 'express';

import {
  addDepartment,
  loginDepartment,
  getDepartmentProfile,
  updateDepartmentProfile,
} from '../controller/departmentController';


import  {authorizeToken } from '../middlewares/generatetoken';


const router = express.Router();



//------------------ DEPARTMENT APIS -------------------------------//
router.post('/addDepartment', addDepartment);
router.post('/loginDepartment', loginDepartment);
router.get(
  '/getDepartmentInfo',
  authorizeToken,
  getDepartmentProfile
);
router.patch(
  '/updateDepartmentInfo',
  authorizeToken,
  updateDepartmentProfile
);


export default router;

















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

