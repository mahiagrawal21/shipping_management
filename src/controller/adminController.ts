// adminController.ts
import { Request, Response } from 'express';
import { AdminModel } from '../models/adminModel';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { Redis } from "../middlewares/session.redis";
import { createClient  } from 'redis';
import { Verify } from "../middlewares/authMiddleware";
import { SessionModel } from '../models/session';
import { Sessions } from "./sessionController";
import { CourierModel } from '../models/courierModel';
import { TrackingUpdate } from '../models/courierModel';
import { ObjectId } from 'mongoose';
import Joi from 'joi';


dotenv.config();

const client  = createClient();
   client.on('error', err => console.log('Redis Client Error', err));
   client.connect();

//    const redisClient = createClient();
//   redisClient.on('error', (err) => console.error('Redis Error:', err));
//   (redisClient as any).connect();


export const signupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});




const saltRounds = 10;

export class AdminController {
  static async  createAdmin(req: Request, res: Response) {
    const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
  
      const adminExists = await AdminModel.findOne({ email });
        if (adminExists) {
          return res.status(400).json({ error: 'Admin already exists' });
        }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newAdmin = new AdminModel({
        username,
        email,
        password: hashedPassword,
        
      });
  
      const admin = await newAdmin.save();
      console.log(admin);
      //  res.status(201).json({ message: 'Admin created successfully', admin });
      res.redirect('/message')
    } catch (error) {
      res.status(500).json({ error: 'Could not create admin' });
    }
}


static async  loginAdmin(req: Request, res: Response) {

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //const { email, password } = req.body;
  const details = req.body;
  console.log(details)
  try {
    
    const device = req.headers.device; // Get the device from headers
    await Verify.verify_login_details.validateAsync(details);
    const admin = await AdminModel.findOne({ email:details.email });
    console.log(admin);
    if (admin) {
          const adminSession = await SessionModel.findOne({admin_id: admin._id});
          console.log(adminSession);
          if(!adminSession || !adminSession.status){
            const isPasswordCorrect = await bcrypt.compare(details.password, admin.password);

            if (isPasswordCorrect) {

              //generate a token
              //const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY4, { expiresIn: '2d' });
              const token = jwt.sign({email: details.email }, process.env.SECRET_KEY4, { expiresIn: '2d' });
              await Sessions.maintain_session(req,res,device, admin,adminSession); 
              await Redis.maintain_session_redis(admin, device);
              //  res.status(201).json({message: "login successfully", isAdmin: admin, token});
              res.redirect('/admin');
              console.log(token);
            }
            else{
              res.status(404).json({message: "password is incorrect"});
            }
          }  
        } 
        else {
          res.status(404).json({ status: "admin not found" });
      }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not log in ,server error' });
  }
}

static async logoutAdmin(req: Request, res: Response) {
  //const admin = await AdminModel.findOne({email:req.body.email});
  //const admin = req.body.email;
  try {
    const { adminId } = req.body;
    if (!adminId) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

    const redisClient = createClient();
    redisClient.on('error', (err) => console.error('Redis Error:', err));
    await redisClient.connect();
    await redisClient.del(`${adminId}_session`);
    await SessionModel.updateOne(
      { admin_id: adminId },
      { $set: { status: 0 } }
    );

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};


}




export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    // const oid = orderId as ObjectId
    // Find the order by orderId
    const order = await CourierModel.findById( orderId );
    console.log(order);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const newTrackingUpdate: TrackingUpdate = {
      timestamp: new Date(),
      location: 'New Location',
      status: 'In Transit',
      save: function (): unknown {
        throw new Error('Function not implemented.');
      }
    };
    console.log("reached above push")
    order.trackingHistory.push(newTrackingUpdate);

    console.log("reached below push")
    
    await order.save();
    // const trackingHistory = order.trackingHistory;
    
    return res.status(200).json({ message: 'Order tracking information', data: order });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




