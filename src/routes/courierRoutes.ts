import express from 'express';
import {
  createCourier,
  updateCourierStatus,
  getCourierById,
  updatePickupAndDeliveryDates,
  getCouriersForDepartment,
  getCourierTrackingById,
  updateCourierDetails,
} from '../controller/courierController'; // Adjust the path

const router = express.Router();

// Route to create a new courier
router.post('/', createCourier);

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

// Add more routes and controller functions as needed

export default router;
