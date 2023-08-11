// import express, { Request, Response } from 'express';
// import authroutes from ./src/routes/authroutes;

// const app = express(); 

// app.use(express.json());

// //app.listen(3000); 

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
  
//   });



// src/main.ts

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes';
import { connectToDatabase } from "./config/database";
 
const app = express();
dotenv.config();
const port = 3000;
app.use(express.json());
connectToDatabase();


//start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
