require('dotenv').config()

import {DeliveryAgentModel} from '../models/deliveryAgentModel'
import {CourierModel} from '../models/courierModel'
import jwt from 'jsonwebtoken'
import Joi from 'joi';
import  bcrypt from 'bcrypt';
//import { validateSchema } from '../middlewares/joivalidation';





// Define validation schemas
export const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  
});
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const addEntrySchema = Joi.object({
  _id: Joi.string().required(),
});

export const markDeliveredSchema = Joi.object({
  _id: Joi.string().required(),
});

export const deleteEntrySchema = Joi.object({
  _id: Joi.string().required(),
});

//Signup- we're using the bcryptjs library to hash the password before storing it in the database. 
//The signup process involves checking if an account with the provided email already exists, and if not, it creates a new DeliveryAgent instance,
// hashes the password, and then saves it to the database. After successfully signing up, the delivery agent is automatically logged in, 
//and an access token is generated using JWT for authentication purposes. You'll need to adjust the schema, model, and any other dependencies according to your project's structure and requirements.

export async function signupDeliveryAgent(req, res) {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

 const {name,email,password} = req.body
//  const email = req.body.email
//   const password = req.body.password

  try {
    const existingDeliveryAgent = await DeliveryAgentModel.findOne({ email });

    if (existingDeliveryAgent) {
      return res.status(409).json({
        status: 'failure',
        message: 'Email already exists',
        data: {},
      });
    }
  
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const newDeliveryAgent = new DeliveryAgentModel({
    email,
    password: hashedPassword,
    name
    // Other delivery agent data can be added here
  });

  const savedDeliveryAgent = await newDeliveryAgent.save();

  // const loggedInDeliveryAgent = { _id: savedDeliveryAgent._id };
  // const accessToken = jwt.sign(loggedInDeliveryAgent, process.env.SECRET_KEY3);
  
  const responseData = {
    deliveryAgent: {
      _id: savedDeliveryAgent._id,
      email: savedDeliveryAgent.email,
      // Other delivery agent data can be included here
    },
    // accessToken,
  };
 
  return res.status(201).json({
    status: 'success',
    message: 'Signup success',
    data: responseData,
  });
} catch (error) {
  return res.status(500).json({ message: error.message });
}
}


/*
@ method: post
@ desc: login of delivery agent
@ access: public
*/
export async function loginDeliveryAgent(req, res) {

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {email,password }= req.body
  // const password = req.body.password

  try {
    const deliveryAgent = await DeliveryAgentModel.findOne({
      email: email,
      // password:password
    }) 
    console.log(deliveryAgent)


    if (!deliveryAgent) {
      return res.status(404).json({
        status: 'failure',
        message: 'No delivery agent found with given credentials',
        data: {},
      })
    }

    const loggedInDeliveryAgent = { _id: deliveryAgent._id }
    const accessToken = jwt.sign(loggedInDeliveryAgent, process.env.SECRET_KEY3)

    if (password === deliveryAgent.password) {
      const delAgent = deliveryAgent.toObject()
      delete delAgent.password
      return res.status(200).json({
        status: 'success',
        message: 'Login Success',
        data: { deliveryAgent: delAgent, accessToken },
      })
    } else {
      console.log(password);
      return res.status(401).json({
        status: 'failure',
        message: 'Incorrect Password',
        data: {},
      })
      
    }
  } catch (error) {
    return res.status(500).json({ message: error.message }) // 400 => invalid user inputs
  }
}

/*
@ method: post
@ desc: add courier entry through courier _id
@ access: private
*/
export async function addEntryDeliveryAgent(req, res) {
  const { error } = addEntrySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const deliveryAgentId = req.deliveryAgent._id
    const courierId = req.body._id
    const courier = await CourierModel.findById(courierId)
    if (!courier) {
      return res.status(404).json({
        status: 'failure',
        message: 'Courier not found',
        data: {},
      })
    }

    if (deliveryAgentId == courier.deliveryAgent) {
      return res.status(400).json({
        status: 'failure',
        message: 'Courier already entered',
        data: {},
      })
    }

    if (courier.deliveryAgent && deliveryAgentId != courier.deliveryAgent) {
      return res.status(400).json({
        status: 'failure',
        message: 'Courier already assigned to different delivery agent',
        data: {},
      })
    }

    await CourierModel.findByIdAndUpdate(courierId, {
      deliveryAgent: deliveryAgentId,
      pickupDate: new Date(),
    })

    return res.status(200).json({
      status: 'success',
      message: 'Courier added for delivery',
      data: {},
    })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong !' })
  }
}

/*
@ method: post
@ desc: update courier as delivered
@ access: private
*/
export async function markDeliveredByDeliveryAgent(req, res) {
  const { error } = markDeliveredSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const deliveryAgentId = req.deliveryAgent._id
    const courierId = req.body._id
    const courier = await CourierModel.findById(courierId)
    if (!courier) {
      return res.status(404).json({
        status: 'failure',
        message: 'Courier not found',
        data: {},
      })
    }

    if (deliveryAgentId != courier.deliveryAgent) {
      return res.status(400).json({
        status: 'failure',
        message:
          'Courier not assigned or already assigned to different delivery agent',
        data: {},
      })
    }

    if (courier.deliveredDate) {
      return res.status(400).json({
        status: 'failure',
        message: 'Courier already delivered',
        data: {},
      })
    }

    await CourierModel.findByIdAndUpdate(courierId, {
      status: 'Delivered',
      deliveredDate: new Date(),
    })

    return res.status(200).json({
      status: 'success',
      message: 'Courier delivered',
      data: {},
    })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong !' })
  }
}

/*
@ method: delete
@ desc: delete a delivery agent
@ access: private (assuming you have middleware that authenticates the admin)
*/
export async function deleteDeliveryAgent(req, res) {
  const { error } = deleteEntrySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { deliveryAgentId } = req.params;
    console.log(deliveryAgentId)

    // Check if the delivery agent exists
    const deliveryAgent = await DeliveryAgentModel.findById(deliveryAgentId);
    if (!deliveryAgent) {
      return res.status(404).json({
        status: 'failure',
        message: 'Delivery agent not found',
        data: {},
      });
    }

    // Delete the delivery agent from the database
    await DeliveryAgentModel.findByIdAndDelete(deliveryAgentId);

    // You can also perform additional cleanup, such as revoking their sessions from Redis

    return res.status(200).json({
      status: 'success',
      message: 'Delivery agent deleted',
      data: {},
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong!' });
  }
}
