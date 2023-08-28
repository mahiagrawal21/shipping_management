"use strict";
// import { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import  { CustomerDocument, CustomerModel, } from '../models/customer';
// const session = require('session')
// const secretkey ='sdfukzsy'
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeDeliveryAgentToken = exports.authorizeToken = exports.authenticateToken = void 0;
// export function createToken(req:Request){
//  const key = secretkey;
//  const token = jwt.sign( 
//  { userId: req.body.email },key,{ expiresIn: "5d" }
//  );
//  return token
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//for customer
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader;
        console.log(authHeader);
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.log(" --------------");
                return res.sendStatus(403);
            }
            console.log(user);
            req.user = user;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
});
exports.authenticateToken = authenticateToken;
//for department
const authorizeToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({
            status: 'failure',
            message: 'Unauthorized',
            data: {},
        });
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY2, (err, departmentInfo) => {
        if (err) {
            return res.status(403).json({
                status: 'failure',
                message: 'Invalid access token',
                data: {},
            });
        }
        req.department = departmentInfo;
        next();
    });
});
exports.authorizeToken = authorizeToken;
//for delivery agent
const authorizeDeliveryAgentToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({
            status: 'failure',
            message: 'Unauthorized',
            data: {},
        });
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY3, (err, deliveryAgentInfo) => {
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
});
exports.authorizeDeliveryAgentToken = authorizeDeliveryAgentToken;
//# sourceMappingURL=generatetoken.js.map