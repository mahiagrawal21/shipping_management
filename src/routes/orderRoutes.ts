import express from 'express';
import {  shipOrder } from '../controller/orderController';
import { startOrderEventsConsumer } from '../controller/orderController';
const router = express.Router();


// router.post('/place-order', placeOrder);


router.post('/ship-order/:orderId', shipOrder);


router.post('/start-consumer', startOrderEventsConsumer);




export default router;
