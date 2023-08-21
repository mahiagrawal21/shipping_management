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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourierDetails = exports.getCourierTrackingById = exports.getCouriersForDepartment = exports.updatePickupAndDeliveryDates = exports.getCourierById = exports.updateCourierStatus = exports.createCourier = void 0;
const courierModel_1 = require("../models/courierModel"); // Adjust the path
const trackerUtils_1 = require("../utilities/trackerUtils");
// Define your controller functions
const createCourier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const trackerID = '1234'
        const trackerID = (0, trackerUtils_1.generateRandomTrackerID)(8);
        //const newCourierData: Courier =req.body; // Assuming you send courier data in the request body
        // const newCourier = await CourierModel.create(req.body, trackerID);
        const { senderDetails, receiverDetails, packageName, packageWeight, status } = req.body;
        const newCourier = new courierModel_1.CourierModel({
            senderDetails,
            receiverDetails,
            packageName,
            packageWeight,
            status,
            tracker: trackerID
        });
        const savedCourier = yield newCourier.save();
        console.log("new courier added");
        res.status(201).json(newCourier);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not create courier' });
    }
});
exports.createCourier = createCourier;
const updateCourierStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courierId = req.params.courierId; // Assuming you pass courierId as a URL parameter
        const { status } = req.body;
        const updatedCourier = yield courierModel_1.CourierModel.findByIdAndUpdate(courierId, { status }, { new: true });
        if (!updatedCourier) {
            return res.status(404).json({ error: 'Courier not found' });
        }
        res.json(updatedCourier);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not update courier status' });
    }
});
exports.updateCourierStatus = updateCourierStatus;
// Fetch courier details by ID
const getCourierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courierId = req.params.courierId;
        const courier = yield courierModel_1.CourierModel.findById(courierId);
        if (!courier) {
            return res.status(404).json({ error: 'Courier not found' });
        }
        res.json(courier);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not fetch courier details' });
    }
});
exports.getCourierById = getCourierById;
// Update pickup and delivery dates
const updatePickupAndDeliveryDates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courierId = req.params.courierId;
        const { pickupDate, deliveredDate } = req.body;
        const updatedCourier = yield courierModel_1.CourierModel.findByIdAndUpdate(courierId, { pickupDate, deliveredDate }, { new: true });
        if (!updatedCourier) {
            return res.status(404).json({ error: 'Courier not found' });
        }
        res.json(updatedCourier);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not update pickup and delivery dates' });
    }
});
exports.updatePickupAndDeliveryDates = updatePickupAndDeliveryDates;
// Get all couriers for a department
const getCouriersForDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentId = req.params.departmentId;
        const couriers = yield courierModel_1.CourierModel.find({ 'tracker.departmentId': departmentId });
        res.json(couriers);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not fetch couriers for the department' });
    }
});
exports.getCouriersForDepartment = getCouriersForDepartment;
// Get courier tracking by ID
const getCourierTrackingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courierId = req.params.courierId;
        const courier = yield courierModel_1.CourierModel.findById(courierId);
        if (!courier) {
            return res.status(404).json({ error: 'Courier not found' });
        }
        const { tracker } = courier;
        res.json(tracker);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not fetch courier tracking by ID' });
    }
});
exports.getCourierTrackingById = getCourierTrackingById;
// Update courier details
const updateCourierDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courierId = req.params.courierId;
        // const updatedDetails: Partial<Courier> = courier.req.body;
        const updatedCourier = yield courierModel_1.CourierModel.findByIdAndUpdate(courierId, 
        //updatedDetails,
        { new: true });
        if (!updatedCourier) {
            return res.status(404).json({ error: 'Courier not found' });
        }
        res.json(updatedCourier);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not update courier details' });
    }
});
exports.updateCourierDetails = updateCourierDetails;
//# sourceMappingURL=courierController.js.map