"use strict";
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
exports.markDeliveredByDeliveryAgent = exports.addEntryDeliveryAgent = exports.loginDeliveryAgent = exports.signupDeliveryAgent = void 0;
require('dotenv').config();
const deliveryAgentModel_1 = require("../models/deliveryAgentModel");
const courierModel_1 = require("../models/courierModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//import { validateSchema } from '../middlewares/joivalidation';
// Define validation schemas
const signupSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const addEntrySchema = joi_1.default.object({
    _id: joi_1.default.string().required(),
});
const markDeliveredSchema = joi_1.default.object({
    _id: joi_1.default.string().required(),
});
//Signup- we're using the bcryptjs library to hash the password before storing it in the database. 
//The signup process involves checking if an account with the provided email already exists, and if not, it creates a new DeliveryAgent instance,
// hashes the password, and then saves it to the database. After successfully signing up, the delivery agent is automatically logged in, 
//and an access token is generated using JWT for authentication purposes. You'll need to adjust the schema, model, and any other dependencies according to your project's structure and requirements.
function signupDeliveryAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const email = req.body.email;
        const password = req.body.password;
        try {
            const existingDeliveryAgent = yield deliveryAgentModel_1.DeliveryAgentModel.findOne({ email });
            if (existingDeliveryAgent) {
                return res.status(409).json({
                    status: 'failure',
                    message: 'Email already exists',
                    data: {},
                });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10); // Hash the password
            const newDeliveryAgent = new deliveryAgentModel_1.DeliveryAgentModel({
                email,
                password: hashedPassword,
                // Other delivery agent data can be added here
            });
            const savedDeliveryAgent = yield newDeliveryAgent.save();
            const loggedInDeliveryAgent = { _id: savedDeliveryAgent._id };
            const accessToken = jsonwebtoken_1.default.sign(loggedInDeliveryAgent, process.env.SECRET_KEY3);
            const responseData = {
                deliveryAgent: {
                    _id: savedDeliveryAgent._id,
                    email: savedDeliveryAgent.email,
                    // Other delivery agent data can be included here
                },
                accessToken,
            };
            return res.status(201).json({
                status: 'success',
                message: 'Signup and Login Success',
                data: responseData,
            });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}
exports.signupDeliveryAgent = signupDeliveryAgent;
/*
@ method: post
@ desc: login of delivery agent
@ access: public
*/
function loginDeliveryAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const email = req.body.email;
        const password = req.body.password;
        try {
            const deliveryAgent = yield deliveryAgentModel_1.DeliveryAgentModel.findOne({
                email: email,
            });
            if (!deliveryAgent) {
                return res.status(404).json({
                    status: 'failure',
                    message: 'No delivery agent found with given credentials',
                    data: {},
                });
            }
            const loggedInDeliveryAgent = { _id: deliveryAgent._id };
            const accessToken = jsonwebtoken_1.default.sign(loggedInDeliveryAgent, process.env.SECRET_KEY3);
            if (password === deliveryAgent.password) {
                const delAgent = deliveryAgent.toObject();
                delete delAgent.password;
                return res.status(200).json({
                    status: 'success',
                    message: 'Login Success',
                    data: { deliveryAgent: delAgent, accessToken },
                });
            }
            else {
                return res.status(401).json({
                    status: 'failure',
                    message: 'Incorrect Password',
                    data: {},
                });
            }
        }
        catch (error) {
            return res.status(500).json({ message: error.message }); // 400 => invalid user inputs
        }
    });
}
exports.loginDeliveryAgent = loginDeliveryAgent;
/*
@ method: post
@ desc: add courier entry through courier _id
@ access: private
*/
function addEntryDeliveryAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deliveryAgentId = req.deliveryAgent._id;
            const courierId = req.body._id;
            const courier = yield courierModel_1.CourierModel.findById(courierId);
            if (!courier) {
                return res.status(404).json({
                    status: 'failure',
                    message: 'Courier not found',
                    data: {},
                });
            }
            if (deliveryAgentId == courier.deliveryAgent) {
                return res.status(400).json({
                    status: 'failure',
                    message: 'Courier already entered',
                    data: {},
                });
            }
            if (courier.deliveryAgent && deliveryAgentId != courier.deliveryAgent) {
                return res.status(400).json({
                    status: 'failure',
                    message: 'Courier already assigned to different delivery agent',
                    data: {},
                });
            }
            yield courierModel_1.CourierModel.findByIdAndUpdate(courierId, {
                deliveryAgent: deliveryAgentId,
                pickupDate: new Date(),
            });
            return res.status(200).json({
                status: 'success',
                message: 'Courier added for delivery',
                data: {},
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Something went wrong !' });
        }
    });
}
exports.addEntryDeliveryAgent = addEntryDeliveryAgent;
/*
@ method: post
@ desc: update courier as delivered
@ access: private
*/
function markDeliveredByDeliveryAgent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deliveryAgentId = req.deliveryAgent._id;
            const courierId = req.body._id;
            const courier = yield courierModel_1.CourierModel.findById(courierId);
            if (!courier) {
                return res.status(404).json({
                    status: 'failure',
                    message: 'Courier not found',
                    data: {},
                });
            }
            if (deliveryAgentId != courier.deliveryAgent) {
                return res.status(400).json({
                    status: 'failure',
                    message: 'Courier not assigned or already assigned to different delivery agent',
                    data: {},
                });
            }
            if (courier.deliveredDate) {
                return res.status(400).json({
                    status: 'failure',
                    message: 'Courier already delivered',
                    data: {},
                });
            }
            yield courierModel_1.CourierModel.findByIdAndUpdate(courierId, {
                status: 'Delivered',
                deliveredDate: new Date(),
            });
            return res.status(200).json({
                status: 'success',
                message: 'Courier delivered',
                data: {},
            });
        }
        catch (error) {
            return res.status(500).json({ message: 'Something went wrong !' });
        }
    });
}
exports.markDeliveredByDeliveryAgent = markDeliveredByDeliveryAgent;
// @ method: post
// @ desc: add courier entry through courier _id
// @ access: private
// */
// async function addEntryDeliveryAgent(req, res) {
//   try {
//     const deliveryAgentId = req.deliveryAgent._id
//     const courierId = req.body._id
//     const courier = await Courier.findById(courierId)
//     if (!courier) {
//       return res.status(404).json({
//         status: 'failure',
//         message: 'Courier not found',
//         data: {},
//       })
//     }
//     if (deliveryAgentId == courier.deliveryAgent) {
//       return res.status(400).json({
//         status: 'failure',
//         message: 'Courier already entered',
//         data: {},
//       })
//     }
//     if (courier.deliveryAgent && deliveryAgentId != courier.deliveryAgent) {
//       return res.status(400).json({
//         status: 'failure',
//         message: 'Courier already assigned to different delivery agent',
//         data: {},
//       })
//     }
//     await Courier.findByIdAndUpdate(courierId, {
//       deliveryAgent: deliveryAgentId,
//       pickupDate: new Date(),
//     })
//     return res.status(200).json({
//       status: 'success',
//       message: 'Courier added for delivery',
//       data: {},
//     })
//   } catch (error) {
//     return res.status(500).json({ message: 'Something went wrong !' })
//   }
// }
//# sourceMappingURL=deliveryAgentController.js.map