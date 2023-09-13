import { Kafka, Partitioners, Producer, ProducerRecord } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'courier-management-producer',
  brokers: ['localhost:9092'], 
});

export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner, 
  });
  

export async function sendOrderShippedEvent(orderId: string) {
 try{
     console.log('Connecting Producer')  
    await producer.connect();
    console.log('Producer connected successfully')

    const orderEvent = {
      order_id: orderId,
      tracking_id: `TR${orderId}`, 
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
    throw error; 
  }
}











    