import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'your-client-id', // Give it a unique name
  brokers: ['localhost:9092'], // Replace with your broker addresses
});

export default kafka;
