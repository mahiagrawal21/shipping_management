// import kafka from "../config/kafkaConfig";


// async function init(){
//     const admin = kafka.admin();
//     console.log("Admin connecting....");
//     admin.connect();
//     console.log("Admin connection Success...");
    
 
//     console.log('Creating Topic [deliveryagent-updates]')
//     admin.createTopics({
//      topics: [
//        {
//          topic: "deliveryagent-updates",
//          numPartitions: 2,
//        },
//      ],
//     });
//     console.log('Topic created success[deliveryagent-updates]');
//      console.log('Disconnecting Admin...');
//     await admin.disconnect();
//   }
//  init();