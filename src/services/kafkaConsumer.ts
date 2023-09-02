import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { handleOrderEvent } from '../controller/orderController'; // Import the handleOrderEvent function

const kafka = new Kafka({
  clientId: 'courier-management-consumer',
  brokers: ['localhost:9092'], // Replace with your broker addresses
});

const consumer = kafka.consumer({ groupId: 'order-events-group' });

export async function runOrderEventsConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const orderEvent = JSON.parse(payload.message.value.toString());
      console.log('Received order event:', orderEvent);
      
       // Call the handleOrderEvent function to process the received event
       await handleOrderEvent(orderEvent);


      try {
        const rawevent = JSON.parse(orderEvent);
        console.log('Received order event:', rawevent);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    },
      // Implement your courier management logic here based on the received event
      // For example, you might update the order status in your database or trigger other actions.
    
  });
}