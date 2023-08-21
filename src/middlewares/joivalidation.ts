import express from 'express';

import {
  loginDeliveryAgent,
  addEntryDeliveryAgent,
  markDeliveredByDeliveryAgent,
  signupDeliveryAgent
} from '../controller/deliveryAgentController'; // Adjust the path

import Joi from 'joi';

// Middleware for Joi validation
export const validateJoiSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};


