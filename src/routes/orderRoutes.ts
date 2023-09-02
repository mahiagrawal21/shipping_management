import express from 'express';
import {  shipOrder } from '../controller/orderController';
import { startOrderEventsConsumer } from '../controller/orderController';
const router = express.Router();

// Route to place an order
// router.post('/place-order', placeOrder);

// Route to ship an order
router.post('/ship-order/:orderId', shipOrder);


// Route to start the order events consumer
router.post('/start-consumer', startOrderEventsConsumer);

// Other order-related routes can be defined here
// For example, routes for updating orders, canceling orders, etc.

export default router;
