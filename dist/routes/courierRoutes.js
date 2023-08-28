"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courierController_1 = require("../controller/courierController"); // Adjust the path
const router = express_1.default.Router();
// Route to create a new courier
router.post('/create', courierController_1.createCourier);
// Route to update courier status by ID
router.put('/:courierId/status', courierController_1.updateCourierStatus);
// Route to get courier details by ID
router.get('/:courierId', courierController_1.getCourierById);
// Route to update pickup and delivery dates by ID
router.put('/:courierId/dates', courierController_1.updatePickupAndDeliveryDates);
// Route to get all couriers for a department
router.get('/department/:departmentId', courierController_1.getCouriersForDepartment);
// Route to get courier tracking by ID
router.get('/:courierId/tracking', courierController_1.getCourierTrackingById);
// Route to update courier details by ID
router.put('/:courierId', courierController_1.updateCourierDetails);
// Route to return and exchange routes
router.post('/return', courierController_1.requestReturn);
router.post('/exchange', courierController_1.requestExchange);
exports.default = router;
//# sourceMappingURL=courierRoutes.js.map