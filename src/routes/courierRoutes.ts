import express from 'express';
import {
  createCourier,
  getAllCouriers,
  addCourierEntry,
  updateCourierStatus,
  getCourierById,
  updatePickupAndDeliveryDates,
  getCouriersForDepartment,
  generateAwb,
  getCourierByAwb,
  updateCourierDetails,
  requestReturn,
  requestExchange,
} from '../controller/courierController'; 

import {
  createCourierSchema,
  updateCourierStatusSchema,

} from '../controller/courierController';
import {authorizeToken} from '../middlewares/generatetoken';
import { validateJoiSchema } from '../middlewares/joivalidation';


const router = express.Router();


router.post('/create', validateJoiSchema(createCourierSchema),createCourier);

//Route for fetching all couriers
router.get('/api/couriers', getAllCouriers);

router.post('/addCourier', authorizeToken, addCourierEntry);


// Route to update courier status by ID
router.put('/:courierId/status', validateJoiSchema(updateCourierStatusSchema),updateCourierStatus);

// Route to get courier details by ID
router.get('/:courierId', getCourierById);

// Route to update pickup and delivery dates by ID
router.put('/:courierId/dates', updatePickupAndDeliveryDates);

// Route to get all couriers for a department
router.get('/department/:departmentId', getCouriersForDepartment);



// Route to update courier details by ID
router.put('/:courierId', updateCourierDetails);

//Route to generate awb number
router.post('/generateAwb/:courierId',generateAwb);

//Route to getcourier by Awb number
router.get('/courierDetails/:awbNumber',getCourierByAwb);

// Route to return and exchange routes
router.post('/return', requestReturn);
router.post('/exchange', requestExchange);


export default router;

