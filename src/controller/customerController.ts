import { Request, Response, NextFunction, response} from 'express';
import  { CustomerDocument, CustomerModel, } from '../models/customer';
import  bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { authenticateToken} from '../middlewares/generatetoken';
import { Sessions } from "./sessionController";
import {SessionModel} from '../models/session';
  import { createClient  } from 'redis';
  //import {compare} from 'bcrypt';
  import { Redis } from "../middlewares/session.redis";
  import { Verify } from "../middlewares/authMiddleware";
  import  nodemailer from 'nodemailer';


 
 
  dotenv.config();
  const client  = createClient();
   client.on('error', err => console.log('Redis Client Error', err));
   client.connect();
  // const redisClient = createClient();
  // redisClient.on('error', (err) => console.error('Redis Error:', err));
  // (redisClient as any).connect();

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
  

//FORGOT PASSWORD 
export class forgotPassword {
   static async forgot_password(req: any, res: any) {
   try {
   const { email:email } = req.body;
   //console.log(req.body);
   const user = await CustomerModel.findOne({email})
   console.log(user);
   if (!user) {
   return res.status(400).json({ message: 'Email not found' });
   }
  
   let OTP = Math.floor(1000 + Math.random() * 9000);
   client.set(email, OTP);
  
   const transporter = nodemailer.createTransport({
   service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: false,
   auth: {
   user: process.env.EMAIL_ADDRESS,
   pass: process.env.EMAIL_PASSWORD,
   },
   });
  
   const mailOptions = {
   from: process.env.EMAIL_ADDRESS,
   to: email,
   subject: 'Password Reset Request',
   text: ` Please click on the following link, or paste this into your browser to complete the process:\n\n
   ${process.env.CLIENT_URL}/RESET PASSWORD OTP: ${OTP}\n\n
   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
   };
  
   transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
   console.log(error);
   return res.status(500).json({ message: 'Error sending email' });
   } else {
   console.log('Email sent: ' + info.response);
   return res.status(200).json({ message: 'Password reset link sent to email' });
   }
   });
   }
   catch (error) {
   console.log(error);
   res.status(500).json({ message: 'Server error' });
   }
   }
  
  static async reset_password(req: any, res: any) {
   try {
     const { email, otp, newPassword } = req.body;
  
   const user = await CustomerModel.findOne({email});;
  
   if (!user) {
   return res.status(400).json({ message: 'Invalid User' });
   }
  
   const userOTP = await client.get(email);
   console.log(userOTP);
   if (!userOTP || userOTP !== otp) {
   return res.status(401).json({ error: 'Invalid OTP' });
   }
  
   //console.log(user.password);
   const hashedPassword = await bcrypt.hash(newPassword , 2);
   user.password = hashedPassword;
   //user.password = await .generate_hash_pass(newPassword);
   console.log(user.password);
   await user.save();
  
   return res.status(200).json({ message: 'Password reset successful' });
   }
   catch (error) {
   console.log(error);
   res.status(500).json({ message: 'Server error' });
  }
 }
}
  

//verification of user registration
 export const verifyAndRegisterUser = async (req: Request, res: Response) => {
  try {
    const { email, otp, password, username } = req.body;

    // Check OTP validity
    const storedOTP = await client.get(email);
    if (!storedOTP || storedOTP !== otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Replace this with your User creation logic
    const newUser = {
      email,
      password: hashedPassword,
      username,
    };

    // Replace this with your User saving logic
    // await newUser.save();

    // Delete OTP from Redis

    await client.del(email);
   

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
 };


























// export const verifyAndRegisterUser = async (ctx: Context) => {
  
//   const redisClient = createClient();
//   redisClient.on('error', (err) => console.error('Redis Error:', err));
//   await redisClient.connect();
//     try {
//       const { email, otp, password,name } = ctx.request.body as {
//         email: string;
//         otp: string;
//         password: string;
//         name:string
//       };
  
//       const storedOTP = await redisClient.get(email);
//       if (!storedOTP || storedOTP !== otp) {
//         ctx.status = 400;
//         ctx.body = { error: 'invalid OTP' };
//         return;
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         email,
//         password: hashedPassword,
//         name,
//       });
  
//       await newUser.save();
//       await redisClient.del(email);
  
//       ctx.status = 201;
//       ctx.body = { message: 'user registered successfully.' };
//     } catch (error) {
//       console.error('error occurred:', error);
//       ctx.status = 500;
//       ctx.body = { error: 'An error occurred' };
//     }
//   };
  
  

  



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