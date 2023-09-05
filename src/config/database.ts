import mongoose from 'mongoose';
import * as models from '../models/model';

async function connectToDatabase() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/shipping_management');
    await mongoose.connect('mongodb://abhijeetsrivastava:abhijeet2128@ac-gvo3lxc-shard-00-00.sq9u8on.mongodb.net:27017,ac-gvo3lxc-shard-00-01.sq9u8on.mongodb.net:27017,ac-gvo3lxc-shard-00-02.sq9u8on.mongodb.net:27017/?replicaSet=atlas-f5xc5h-shard-0&ssl=true&authSource=admin');
    console.log('Connected to MongoDB');
    models.CustomerModel;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export {connectToDatabase};