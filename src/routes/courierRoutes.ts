import express from 'express';
import {
  createCourier,
  getAllCouriers,
  updateCourierStatus,
  getCourierById,
  updatePickupAndDeliveryDates,
  getCouriersForDepartment,
  
  updateCourierDetails,
  requestReturn,
  requestExchange,
} from '../controller/courierController'; 

const router = express.Router();




router.post('/create', createCourier);

//Route for fetching all couriers
router.get('/api/couriers', getAllCouriers);


// Route to update courier status by ID
router.put('/:courierId/status', updateCourierStatus);

// Route to get courier details by ID
router.get('/:courierId', getCourierById);

// Route to update pickup and delivery dates by ID
router.put('/:courierId/dates', updatePickupAndDeliveryDates);

// Route to get all couriers for a department
router.get('/department/:departmentId', getCouriersForDepartment);



// Route to update courier details by ID
router.put('/:courierId', updateCourierDetails);

// Route to return and exchange routes
router.post('/return', requestReturn);
router.post('/exchange', requestExchange);


export default router;

