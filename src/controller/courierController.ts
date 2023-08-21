import { Request, Response } from 'express'; // Assuming you're using Express
import {CourierModel} from '../models/courierModel'; // Adjust the path
import { generateRandomTrackerID } from '../utilities/trackerUtils';

// Define your controller functions
export const createCourier = async (req: Request, res: Response) => {
  try {
    //const trackerID = '1234'
     const trackerID = generateRandomTrackerID(8);
    //const newCourierData: Courier =req.body; // Assuming you send courier data in the request body
    // const newCourier = await CourierModel.create(req.body, trackerID);
    const { senderDetails,receiverDetails,packageName,packageWeight,status} = req.body;
    const newCourier = new CourierModel({
    
      senderDetails,
      receiverDetails,
      packageName,
      packageWeight,
      status,
      tracker:trackerID
    })
    const savedCourier = await newCourier.save();
    console.log("new courier added");
    res.status(201).json(newCourier);
   
  } catch (error) {
    res.status(500).json({ error: 'Could not create courier' });
  }
  
};

export const updateCourierStatus = async (req: Request, res: Response) => {
  try {
    const courierId = req.params.courierId; // Assuming you pass courierId as a URL parameter
    const { status } = req.body; 

    const updatedCourier = await CourierModel.findByIdAndUpdate(
      courierId,
      { status },
      { new: true }
    );

    if (!updatedCourier) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    res.json(updatedCourier);
  } catch (error) {
    res.status(500).json({ error: 'Could not update courier status' });
  }
};

// Fetch courier details by ID
export const getCourierById = async (req: Request, res: Response) => {
    try {
      const courierId = req.params.courierId;
      const courier = await CourierModel.findById(courierId);
  
      if (!courier) {
        return res.status(404).json({ error: 'Courier not found' });
      }
  
      res.json(courier);
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch courier details' });
    }
  };


  // Update pickup and delivery dates
export const updatePickupAndDeliveryDates = async (req: Request, res: Response) => {
    try {
      const courierId = req.params.courierId;
      const { pickupDate, deliveredDate } = req.body;
  
      const updatedCourier = await CourierModel.findByIdAndUpdate(
        courierId,
        { pickupDate, deliveredDate },
        { new: true }
      );
  
      if (!updatedCourier) {
        return res.status(404).json({ error: 'Courier not found' });
      }
  
      res.json(updatedCourier);
    } catch (error) {
      res.status(500).json({ error: 'Could not update pickup and delivery dates' });
    }
  };
  
// Get all couriers for a department
export const getCouriersForDepartment = async (req: Request, res: Response) => {
    try {
      const departmentId = req.params.departmentId;
      const couriers = await CourierModel.find({ 'tracker.departmentId': departmentId });
  
      res.json(couriers);
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch couriers for the department' });
    }
  };

  
  // Get courier tracking by ID
  export const getCourierTrackingById = async (req: Request, res: Response) => {
    try {
      const courierId = req.params.courierId;
      const courier = await CourierModel.findById(courierId);
  
      if (!courier) {
        return res.status(404).json({ error: 'Courier not found' });
      }
  
      const { tracker } = courier;
      res.json(tracker);
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch courier tracking by ID' });
    }
  };
  
  // Update courier details
  export const updateCourierDetails = async (req: Request, res: Response) => {
    try {
      const courierId = req.params.courierId;
      // const updatedDetails: Partial<Courier> = courier.req.body;
  
      const updatedCourier = await CourierModel.findByIdAndUpdate(
        courierId,
        //updatedDetails,
        { new: true }
      );
  
      if (!updatedCourier) {
        return res.status(404).json({ error: 'Courier not found' });
      }
  
      res.json(updatedCourier);
    } catch (error) {
      res.status(500).json({ error: 'Could not update courier details' });
    }
  };
  
