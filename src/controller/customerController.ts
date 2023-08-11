import { Request, Response, NextFunction, response} from 'express';
import  { CustomerDocument, CustomerModel, } from '../models/customer';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { authenticateToken} from '../middlewares/generatetoken';
import { Sessions } from "./sessionController";
import {SessionModel} from '../models/session';
  import { createClient } from 'redis';
  //import {compare} from 'bcrypt';
  import { Redis } from "../middlewares/session.redis";
  import { Verify } from "../middlewares/authMiddleware";


  dotenv.config();
  const client = createClient();
  client.on('error', err => console.log('Redis Client Error', err));
  client.connect();



export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers: CustomerDocument[] = await CustomerModel.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
};



//  CUSTOMER SIGNUP :-
export const signup = async (req: Request, res: Response, next: NextFunction) => {
   try {
   const { username:username, email:email, password:password} = req.body;
   
   const existingUser = await CustomerModel.findOne({ email });
  
   if (existingUser) {
   return res.status(409).json({ error: "Email already exists" });
   }
   const saltRounds = 8;
   const salt = await bcrypt.genSalt(saltRounds);
  
   const hashedPassword = await bcrypt.hash(password, salt);
  
   const user_1 = new CustomerModel({ username, email, password: hashedPassword });
  
   await user_1.save();
  //  res.status(201).json(user_1);
  res.status(201).json({ message: "User Register Successfully" });
   } catch (err) {
   console.log(err);
   res.status(500).json({ message:"Server error" });
   }
  };


  //CUSTOMER LOGIN:-

  export class LoginUser{
    static async user_login(req,res){
        const details = req.body;
        try{
          const device =req.headers.device;
            await Verify.verify_login_details.validateAsync(details);
            const user = await CustomerModel.findOne({email:details.email});
            console.log(user);
            if(user){
                const userSession = await SessionModel.findOne({user_id: user._id});
                console.log(userSession);
                if(!userSession || !userSession.status){
                    const hash = user.password;
                    if(bcrypt.compare(details.password, hash)){
                        const token = jwt.sign({email: details.email}, process.env.SECRET_KEY, {expiresIn: '2d'} );
                        await Sessions.maintain_session(req,res,device, user,userSession); 
                        await Redis.maintain_session_redis(user, device);
                        res.status(201).json({message: "login successfully", isUser: user, token});
                        console.log(token);
                        
                    }
                    else{
                        res.status(404).json({message: "password is incorrect"});
                    }
                }
                else{
                    res.status(404).json({message: "User is already active"})
                }
            }
            else {
                res.status(404).json({ status: "user not found" });
            }
        }
        catch(err){
            res.status(500).json({status: "Server Error"});
        }
    }
}
  
  // export const loginuser = async (req: Request, res: Response, next: NextFunction) => {
  //  try {
  //  const { username, password } = req.body;
  //  const user_1 = await CustomerModel.findOne({ username: username });
  
  //  if (!user_1) {
  //  return res.status(404).json({ error: "User not found" });
  //  }
  
  //  const passwordMatch = await compare(password, user_1.password.toString());
  
  //  if (!passwordMatch) {
  //  throw new Error("email password not matched");
  //  }
  
  //  const session1 = new SessionModel({
  //  user_id: user_1._id,
  //  status: "Active",
  //  expire_at: "1000"
  //  });
  
  //  await session1.save(); 
  // await client.set(${user_1._id}_session, JSON.stringify(user_1));
  
  //  const token = createToken(req);
  // // res.send({token:token})
  //  res.status(200).json({ message: 'Login successful' });
  //  } catch (error) {
  //  console.error("Login Error:", error);
  //  res.status(500).json({ error: "An error occurred during login" });
  //  }
  // }; 