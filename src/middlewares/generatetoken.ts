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


//for customer
const SECRET_KEY = process.env.SECRET_KEY;

export const authenticateToken = async (req, res, next) => {  
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    console.log(authHeader);
    
    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
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


//for department
export const authorizeToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).json({
      status: 'failure',
      message: 'Unauthorized',
      data: {},
    });
  }

  jwt.verify(token, process.env.SECRET_KEY2, (err, departmentInfo) => {
    if (err) {
      return res.status(403).json({
        status: 'failure',
        message: 'Invalid access token',
        data: {},
      });
    }
    req.department = departmentInfo
    next();
  });
}


//for delivery agent

export const authorizeDeliveryAgentToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).json({
      status: 'failure',
      message: 'Unauthorized',
      data: {},
    });
  }
  
  jwt.verify(token, process.env.SECRET_KEY3, (err, deliveryAgentInfo) => {
    if (err) {
      return res.status(403).json({
        status: 'failure',
        message: 'Invalid access token',
        data: {},
      });
    }
    req.deliveryAgent = deliveryAgentInfo;
    next();
  });
}

