// import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import  { CustomerDocument, CustomerModel, } from '../models/customer';
// const session = require('session')
// const secretkey ='sdfukzsy'

// export function createToken(req:Request){

//  const key = secretkey;
//  const token = jwt.sign( 
//  { userId: req.body.email },key,{ expiresIn: "5d" }
//  );
//  return token
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    console.log(authHeader);
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log(" --------------");
        
        return res.sendStatus(403);
      }
      console.log(user);
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export {authenticateToken};