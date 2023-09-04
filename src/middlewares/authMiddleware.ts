import Joi from 'joi';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { AdminModel } from '../models/adminModel';
import { NextFunction } from 'express';
dotenv.config();


const key = process.env.SECRET_KEY;

export class Verify {
    static async verify_token(token: string) {
        // const token = req.headers.authorization;
        console.log(token);
        if (token) {
            const decoded = jwt.verify(token, key);
            return decoded;
        }
        else {
            return false;
        }
    }

    static verify_login_details = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required()
    });

}


// export const authenticateJWTForReview = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header('Authorization');
  
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
  
//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }
  
//       // Check if the user has the necessary permissions to create a review (e.g., is a customer)
//       if (!decoded || !decoded.userId) {
//         return res.status(403).json({ message: 'Forbidden' });
//       }
  
//       req.user = decoded;
//       next();
//     });
//   };





































//index.ts-code
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { User } from './src/models/user'; // Assuming you have a User model

// // Configure the local strategy for passport
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     // Find the user in your database based on the username
//     User.findOne({ username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: 'Invalid username' });
//       }
//       // Compare the provided password with the stored password
//       if (!user.comparePassword(password)) {
//         return done(null, false, { message: 'Invalid password' });
//       }
//       return done(null, user);
//     });
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());



// import passport from 'passport';
// import { Request, Response, NextFunction } from 'express';

// export function authenticate(req: Request, res: Response, next: NextFunction): void {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.status(401).json({ message: info.message });
//     }
//     req.logIn(user, (loginErr) => {
//       if (loginErr) {
//         return next(loginErr);
//       }
//       next();
//     });
//   })(req, res, next);
// }

