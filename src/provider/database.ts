import mongoose from 'mongoose';

const url='mongodb://localhost:27017';
export const db= ()=>{
// Connect to MongoDB
mongoose.connect(url,  {
}).then(() => {
    console.log('Connected to MongoDB');
  })
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });}
  