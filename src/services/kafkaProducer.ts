import { Kafka, Partitioners, Producer, ProducerRecord } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'courier-management-producer',
  brokers: ['localhost:9092'], // Replace with your broker addresses
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner, // Add this option
  });
  

export async function sendOrderShippedEvent(orderId: string) {
 try{
       
    await producer.connect();

    const orderEvent = {
      order_id: orderId,
      tracking_id: `TR${orderId}`, // Generate a tracking ID here
      status: 'shipped',
   };

  const message: ProducerRecord = {
    topic: 'order-events',
    messages: [{ key: orderEvent.order_id, value: JSON.stringify(orderEvent) }],
  };

  await producer.send(message);

  console.log('Order shipped event sent to Kafka');

  await producer.disconnect();

 }catch (error) {
    console.error('Error sending order shipped event:', error);
    throw error; // Rethrow the error for error handling in the controller
  }
}











    