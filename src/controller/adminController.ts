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





dotenv.config();

const client  = createClient();
   client.on('error', err => console.log('Redis Client Error', err));
   client.connect();

//    const redisClient = createClient();
//   redisClient.on('error', (err) => console.error('Redis Error:', err));
//   (redisClient as any).connect();


const saltRounds = 10;

export class AdminController {
  static async  createAdmin(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
  
      const adminExists = await AdminModel.findOne({ username });
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


























// static async logoutAdmin(req: Request, res: Response) {
//   try {
//     //const { token }  = req.headers; // Assuming you send the token in the headers
//     const token = req.headers.authorization as string;
//     console.log("----",token)
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
    

//     const decodedToken = jwt.verify(token, process.env.SECRET_KEY4)as {
//       admin: any; email: string; 
// };
//     console.log("##",decodedToken);
//     const adminId = decodedToken. admin._id
//   console.log("@@",adminId)
//     const adminSession = await SessionModel.findOne({ admin_id: adminId});

//     if (adminSession) {
//       adminSession.status = false; // Mark the session as inactive
//       await adminSession.save();

//       // Remove the token from Redis
//       const redisKey = `admin:${adminId}`;
//       const deleted = await client.del(redisKey);
      
//       if (deleted === 1) {
//         res.status(200).json({ message: 'Logged out successfully' });
//       } else {
//         res.status(500).json({ error: 'Could not remove session from Redis' });
//       }
//     } else {
//       res.status(404).json({ message: 'Session not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Server Error' });
//   }
// }


