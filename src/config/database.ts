import mongoose from 'mongoose';
import * as models from '../models/model';

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/shipping_management');
    console.log('Connected to MongoDB');
    models.CustomerModel;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export {connectToDatabase};