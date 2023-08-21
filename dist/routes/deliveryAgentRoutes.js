"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliveryAgentController_1 = require("../controller/deliveryAgentController"); // Adjust the path
const joivalidation_1 = require("../middlewares/joivalidation");
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
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
//Route for delivery agent signup
router.post('/signup', (0, joivalidation_1.validateJoiSchema)(signupSchema), deliveryAgentController_1.signupDeliveryAgent);
// Route for delivery agent login
router.post('/login', (0, joivalidation_1.validateJoiSchema)(loginSchema), deliveryAgentController_1.loginDeliveryAgent);
// Route to add courier entry through courier _id
router.post('/add-entry', (0, joivalidation_1.validateJoiSchema)(addEntrySchema), deliveryAgentController_1.addEntryDeliveryAgent);
// Route to mark courier as delivered by delivery agent
router.post('/mark-delivered', (0, joivalidation_1.validateJoiSchema)(markDeliveredSchema), deliveryAgentController_1.markDeliveredByDeliveryAgent);
// Add more routes and controller functions as needed
exports.default = router;
//# sourceMappingURL=deliveryAgentRoutes.js.map