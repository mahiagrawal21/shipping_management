// // src/utilities/trackerUtils.ts
// export function generateRandomTrackerID(length: number): string {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let trackerID = '';
  
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       trackerID += characters.charAt(randomIndex);
//     }
  
//     return trackerID;
//   }
  

// src/utilities/trackerUtils.ts
// export function generateRandomTrackerID(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let trackerID = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    trackerID += characters.charAt(randomIndex);
  }

  console.log(trackerID);

