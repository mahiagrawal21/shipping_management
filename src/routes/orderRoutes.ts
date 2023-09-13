import express from 'express';
import {   shipOrder } from '../controller/orderController';
import { startOrderEventsConsumer } from '../controller/orderController';
import {updateShipmentStatus} from '../controller/orderController';
import {processTrackingUpdate} from '../controller/orderController';
const router = express.Router();


// router.post('/place-order', placeOrder);


router.post('/ship-order/:orderId', shipOrder);


router.post('/start-consumer', startOrderEventsConsumer);


router.put('/orders/:orderId/status', updateShipmentStatus);

router.post('/start-update-consumer',processTrackingUpdate);


export default router;
