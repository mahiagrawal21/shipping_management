import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { handleOrderEvent } from '../controller/orderController'; 
import { CourierModel } from '../models/courierModel';
import {processTrackingUpdate} from '../controller/orderController';


const kafka = new Kafka({
  clientId: 'courier-management-consumer',
  brokers: ['localhost:9092'], 
});

const consumer = kafka.consumer({ groupId: 'order-events-group' });

export async function runOrderEventsConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const orderEvent = JSON.parse(payload.message.value.toString());
      console.log('Received order event:', orderEvent);
      
       // handleOrderEvent function to process the received event
       await handleOrderEvent(orderEvent);


      try {
        const rawevent = JSON.parse(orderEvent);
        console.log('Received order event:', rawevent); 
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    },
      
    
  });
}

export async function updateShipmentStatuss() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events',fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { key, value } = message;
      const { status, location ,orderId} = JSON.parse(value.toString());
  
      await processTrackingUpdate(orderId,status,location);
      // await CourierModel.updateOne({ orderId: key }, { status, location });
  
      console.log(`Received tracking update for order ${key}: Status: ${status}, Location: ${location}`);
    },
  });
}
