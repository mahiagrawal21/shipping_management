
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
//import customerRoutes from './routes/customerRoutes';
import deliveryAgentRoutes from './routes/deliveryAgentRoutes';
import courierRoutes from './routes/courierRoutes';
import customerRoutes from './routes/customerRoutes';
import { connectToDatabase } from "./config/database";
 
const app = express();
dotenv.config();
const port = 3000;
app.use(express.json());
connectToDatabase();

app.use('/couriers', courierRoutes);
app.use('/delivery-agents', deliveryAgentRoutes);
app.use('/customer',customerRoutes);

//start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
