import { Request, Response } from 'express';
import { sendOrderShippedEvent } from '../services/kafkaProducer';
import { runOrderEventsConsumer, updateShipmentStatuss } from '../services/kafkaConsumer';
import { CourierModel } from '../models/courierModel';
import { producer} from '../services/kafkaProducer';

// Handler for placing an order
// export const placeOrder = async (req: Request, res: Response) => {
//   try {
//     const { orderId, orderDetails } = req.body;

//     // Implement your logic to process the order placement
//     // For example, save the order details to the database

//     // Assuming the order placement was successful, send a Kafka event
//     await sendOrderShippedEvent('order-events', orderId, JSON.stringify({ status: 'placed' }));

//     res.json({ message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ error: 'An error occurred while placing the order' });
//   }
// };

//PRODUCER-
// Handler for shipping an order
export const shipOrder = async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
  
      // Implement your logic to handle shipping the order
      const order = await CourierModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the order is already shipped
    if (order.status === 'shipped') {
      return res.status(400).json({ error: 'Order is already shipped' });
    }

    // Update the order status to "shipped"
    order.status = 'shipped';
    await order.save();
  
      // Assuming the order was successfully shipped, send a Kafka event



      await sendOrderShippedEvent(orderId);
  
      res.json({ message: 'Order shipped successfully' });
    } catch (error) {
      console.error('Error shipping order:', error);
      res.status(500).json({ error: 'An error occurred while shipping the order' });
    }
  };


// handlers for updating orders, canceling orders, etc.
export const updateShipmentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, location } = req.body;

    // Update the shipment status and location in the database
    await CourierModel.updateOne( { status, location });

    // Produce a Kafka message with the tracking update
    await producer.send({
      topic:  'order-events',
      messages: [
        {
          key: orderId,
          value: JSON.stringify({ status, location }),
        },
      ],
    });
    
    return res.json({ message: 'Tracking update sent successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



//.......................................................................................................................................

//CONSUMER-
export const startOrderEventsConsumer = async (req: Request, res: Response) => {
  try {
    await runOrderEventsConsumer();
    res.json({ message: 'Order events consumer started successfully' });
  } catch (error) {
    console.error('Error starting order events consumer:', error);
    res.status(500).json({ error: 'An error occurred while starting the consumer' });
  }
};


export const handleOrderEvent = async (orderEvent: any) => {
  try {
    // Update your courier management system based on the received event
    if (orderEvent.status === 'shipped') {
      const courierId = orderEvent.order_id;
      const newStatus = 'Shipped';

      // Update the courier's status in your database
      await CourierModel.findOneAndUpdate(
        { _id: courierId },
        { status: newStatus }
      );

      console.log(`Courier ${courierId} status updated to ${newStatus}`);
    }

   

  } catch (error) {
    console.error('Error handling order event:', error);
  }
};

//.........................................................................................................................

//consumer controller file for above updateShipmentStatus producer controller
export async function  processTrackingUpdate(orderId, status, location) {
  try {
    await updateShipmentStatuss();
    // Update the shipment status and location in the database
    await CourierModel.updateOne({ orderId }, { status, location });
    console.log(`Updated tracking information for order ${orderId}: Status - ${status}, Location - ${location}`);
  } catch (error) {
    console.error(`Error processing tracking update for order ${orderId}:`, error);
  }
}