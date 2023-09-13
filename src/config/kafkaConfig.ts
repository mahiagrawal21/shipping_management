import { Kafka } from 'kafkajs';

// const kafka = new Kafka({
//   clientId: 'your-client-id', // Give it a unique name
//   brokers: ['localhost:9092'], // Replace with your broker addresses
// });

const kafka = new Kafka({
  clientId: 'shipment-tracker',
  brokers: ['localhost:9092'], // Kafka broker address
});

// export const producer = kafka.producer();

// export const consumer = kafka.consumer({ groupId: 'shipment-tracking-consumer' });

// export const trackingTopic = 'shipment-tracking';

 
 export default kafka;
