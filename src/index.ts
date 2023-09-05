
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import deliveryAgentRoutes from './routes/deliveryAgentRoutes';
import courierRoutes from './routes/courierRoutes';
import customerRoutes from './routes/customerRoutes';
import { connectToDatabase } from "./config/database";
import kafka from './config/kafkaConfig';
import orderRoutes from './routes/orderRoutes';
import departmentRoutes from './routes/departmentRoutes';
import adminRoutes from './routes/adminRoutes';
import reviewRoutes from './routes/reviewRoutes';
import viewrouter from './routes/view.routes';
// import path from "path"
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express'
import * as path from 'path'
import * as YAML from 'yamljs'

 
const app = express();
dotenv.config();swaggerUi
const port = 3000;
app.use(express.json());
connectToDatabase();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
// app.use((swaggerDocument, '/api-docs'));

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));   
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/couriers', courierRoutes);
app.use('/delivery-agents', deliveryAgentRoutes);
app.use('/customer',customerRoutes,reviewRoutes);
app.use('/department',departmentRoutes);
app.use('/orders',orderRoutes);
app.use('/admin',adminRoutes);
app.use('/review',reviewRoutes);
app.use('/', viewrouter);

app.use('/', express.static(path.join(__dirname, '..', 'views'), {  index: false,}));




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
