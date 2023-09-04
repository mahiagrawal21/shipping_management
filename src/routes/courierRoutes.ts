import express from 'express';
import {
  createCourier,
  updateCourierStatus,
  getCourierById,
  updatePickupAndDeliveryDates,
  getCouriersForDepartment,
  getCourierTrackingById,
  updateCourierDetails,
  requestReturn,
  requestExchange,
} from '../controller/courierController'; 

const router = express.Router();




router.post('/create', createCourier);

// Route to update courier status by ID
router.put('/:courierId/status', updateCourierStatus);

// Route to get courier details by ID
router.get('/:courierId', getCourierById);

// Route to update pickup and delivery dates by ID
router.put('/:courierId/dates', updatePickupAndDeliveryDates);

// Route to get all couriers for a department
router.get('/department/:departmentId', getCouriersForDepartment);

// Route to get courier tracking by ID
router.get('/:courierId/tracking', getCourierTrackingById);

// Route to update courier details by ID
router.put('/:courierId', updateCourierDetails);

// Route to return and exchange routes
router.post('/return', requestReturn);
router.post('/exchange', requestExchange);


export default router;

