// reviewRoutes.ts
import express from 'express';
import { createReview, getReviewsByCourier } from '../controller/reviewController';
import { authenticateToken } from '../middlewares/generatetoken';

const router = express.Router();

// Create a new review 
router.post('/createreview', createReview);

// Get reviews for a specific courier
router.get('/courier/:courierId', getReviewsByCourier);

export default router;
