// reviewRoutes.ts
import express from 'express';
import { createReview, getReviewsByCourier,updateReview, deleteReview} from '../controller/reviewController';
import { authenticateToken } from '../middlewares/generatetoken';

const router = express.Router();

// Create a new review 
router.post('/createreview', createReview);

// Get reviews for a specific courier
router.get('/courier/:courierId', getReviewsByCourier);

//Update review
router.put('/:reviewId', updateReview);

//Delete the review
router.delete('/:reviewId',deleteReview);

export default router;
