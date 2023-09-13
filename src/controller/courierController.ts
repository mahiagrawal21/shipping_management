import { Request, Response } from 'express'; // Assuming you're using Express
 import {CourierModel, Courier, TrackingUpdate} from '../models/courierModel'; // Adjust the path
import { DepartmentModel } from '../models/departmentModel';
import { generateRandomTrackerID } from '../utilities/trackerUtils';
import { CustomerModel } from '../models/customer';
import { sendEmail } from '../utilities/send_email_helper';
import { URL } from "url";
import { generateAwbNumber } from '../utilities/awbGenerator';
import Joi from 'joi';

interface CustomerRequest extends Request {
  department: {
    _id: string;
  };
}

export const createCourierSchema = Joi.object({
  senderDetails: Joi.string().alphanum().length(24).required(), 
  receiverDetails: Joi.string().alphanum().length(24).required(),
  departmentStatus: Joi.string().valid('accepted', 'out of delivery', 'dispatched', 'unsuccessful', 'delivered').required(),
  packageName: Joi.string().required(),
  packageWeight: Joi.string().required(),
  status: Joi.string().valid('pending', 'shipped', 'delivered').required(),
});

export const updateCourierStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'shipped', 'delivered').required(),
  location: Joi.string().required(),
});

export const createCourier = async (req: Request, res: Response) => {
    const { error } = createCourierSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    //const trackerID = '1234'
     const trackerID = generateRandomTrackerID(8);
    //const newCourierData: Courier =req.body; // Assuming you send courier data in the request body
    // const newCourier = await CourierModel.create(req.body, trackerID);
    const { senderDetails,receiverDetails,departmentStatus,packageName,packageWeight,status} = req.body;
    const newCourier = new CourierModel({
      
      senderDetails,
      receiverDetails,
      departmentStatus,
      packageName,
      packageWeight,
      status,
      tracker:trackerID
    })
     const savedCourier = await newCourier.save();
    console.log("new courier added ,Order placed successfully");
    console.log(savedCourier);
    res.status(201).json(newCourier);
   
  } catch (error) {
    res.status(500).json({ error: 'Could not create courier' });
  }
  
};

/*
@ method: post
@ desc: adding a courier by the logged in department either initialiser or in transit agencies
@ access: private
*/
export const addCourierEntry = async (req: CustomerRequest, res: Response)=> {
  try {
    
    const departmentId = req.body.department._id; // this is the id of loggedin department who is currently making the entry of this courier to their department (can be initiator as well as middle ones)
    const department = await DepartmentModel.findById(departmentId).select('-password');

    const courierDetails = req.body.courierDetails;
    const existingCourier = await CourierModel.findById(courierDetails._id)
      // .populate('senderDetails')
      .populate('receiverDetails');
      

    if (existingCourier) {
      // if courier exist already that means this courier department is the middle one in courier transit journey
      // change status and all etc. functionalities
      if (Object.values(existingCourier.tracker).includes(departmentId)) {
        return res.status(400).json({
          status: 'failure',
          message: 'Courier already entered',
          data: existingCourier,
        })
      }
      
      const midStatus = `Package arrived at ${department.name}, ${department.location}, ${department.city}`

      const getDate = Date.now().toString()
      existingCourier.tracker[getDate] = departmentId
      
      // existingCourier.departmentStatus[departmentId] = 'accepted'
      const courier = await CourierModel.findByIdAndUpdate(courierDetails._id, {
        tracker: existingCourier.tracker,
        status: midStatus,
        departmentStatus: existingCourier.departmentStatus,
        updatedAt: Date.now(),
      })
      
      const refererURL = new URL(req.headers.referer);
      await sendEmail(
        existingCourier._id,
        // existingCourier.receiverDetails.email,
        receiverDetails.email,
        // parse(req.headers.referer).host
        refererURL.host
      )

      return res.status(204).json({
        status: 'success',
        message: 'Courier Entry Successful',
        data: courier,
      })
    } else {
      // brand new courier no receiver/sender details yet so create one from req
      var sender = req.body.senderDetails
      var senderDetails = await CustomerModel.findOne({
        email: sender.email,
      })

      // if (!senderDetails) {
      //   senderDetails = await new customer(sender).save()
      // }

      const sd = senderDetails.toObject()
      delete sd._id
      delete sd.__v

      if (
        !(
          Object.entries(sender).sort().toString() ===
          Object.entries(sd).sort().toString()
        )
      ) {
        return res.status(400).json({
          status: 'failure',
          message:
            'Return Customer - Sender details does not match with the email associated',
          data: {},
        })
      }

      var receiver = req.body.receiverDetails
      var receiverDetails = await CustomerModel.findOne({
        email: receiver.email,
      })
      // if (!receiverDetails) {
      //   receiverDetails = await new Customer(receiver).save()
      // }

      const rd = receiverDetails.toObject()
      delete rd._id
      delete rd.__v

      if (
        !(
          Object.entries(receiver).sort().toString() ===
          Object.entries(rd).sort().toString()
        )
      ) {
        return res.status(400).json({
          status: 'failure',
          message:
            'Return Customer - Receiver details does not match with the email associated',
          data: {},
        })
      }
      
      const initialStatus = `Packed at ${department.name}, ${department.location}, ${department.city}`
      var getDate = Date.now().toString()
      const trackerObject = {}
      trackerObject[getDate] = departmentId
      const initialTracker = trackerObject
      const depStatus = {}
      depStatus[departmentId] = 'Accepted'

      const courier = await new CourierModel({
        senderDetails: senderDetails._id,
        receiverDetails: receiverDetails._id,
        packageName: courierDetails.packageName,
        packageWeight: courierDetails.packageWeight,
        status: initialStatus,
        departmentStatus: depStatus,
        tracker: initialTracker,
      }).save()
     
      const refererURL = new URL(req.headers.referer);
      await sendEmail(
        courier._id,
        receiverDetails.email,
        // url.parse(req.headers.referer).host
        refererURL.host
      );


      return res.status(204).json({
        status: 'success',
        message: 'Courier Entry Successful',
        data: courier,
      })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: 'Something went wrong !' })
  }
}


//Update courier entry :
export const updateCourierStatus = async (req: Request, res: Response) => {
  const { error } = updateCourierStatusSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const courierId = req.params.courierId; // Assuming you pass courierId as a URL parameter
    const { status, location} = req.body; 

    const updatedCourier = await CourierModel.findByIdAndUpdate(
      courierId,
      { status,location },
      { new: true }
    );
    const newTrackingUpdate: TrackingUpdate = {
      timestamp: new Date(),
      location,
      status,
      save: function (): unknown {
        throw new Error('Function not implemented.');
      }
    };
    updatedCourier.trackingHistory.push(newTrackingUpdate);
    await updatedCourier.save();


    if (!updatedCourier) {
      return res.status(404).json({ error: 'Courier not found' });
    }

    res.json(updatedCourier);
    res.send('Order status updated successfully');
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
  
  export const getAllCouriers = async (req: Request, res: Response): Promise<void> => {
    try {
      const allCouriers: Courier[] = await CourierModel.find();
      res.status(200).json({
        status: 'success',
        message: 'Couriers Fetched Successfully',
        data: allCouriers,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Something went wrong!' });
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
 
  //Generate AWBNumber
export const generateAwb = async (req:Request, res: Response) => {
  const courierId = req.params.courierId as string;
   console
  try {
    const courier = await CourierModel.findById(courierId);

    if (!courier) {
      return res.status(404).json({ message: 'Order/courier not found' });
    }

    if (courier.awbNumber) {
      return res.status(400).json({ message: 'AWB number already generated' });
    }

    const awbNumber = generateAwbNumber();
    courier.awbNumber = awbNumber;

    console.log(awbNumber);
    await courier.save();

    res.json({ awbNumber });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

//Fetch courier details by awb
export const getCourierByAwb = async (req:Request, res:Response)=> {
  const awbNumber = req.params.awbNumber;
  try {
    const courier = await CourierModel.findOne({ awbNumber });

    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    res.json(courier);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};





  
// Returnorder
export const  requestReturn = async (req: Request, res: Response) => {
  try {
    const { courierId, returnReason } = req.body;
console.log(courierId)
    const updatedCourier = await CourierModel.findByIdAndUpdate(
      courierId,
      { status: 'Returned', returnReason },
      { new: true }
    );
    await updatedCourier.save();
    res.json(updatedCourier);
  } catch (error) {
    res.status(500).json({ error: 'Could not request return' });
  }
};

//Exchange order
export const requestExchange = async (req: Request, res: Response) => {
  try {
    const { courierId, exchangeDetails } = req.body;

    const updatedCourier = await CourierModel.findByIdAndUpdate(
      courierId,
      { status: 'Exchanged', exchangeDetails },
      { new: true }
    );
    await updatedCourier.save();
    res.json(updatedCourier);
  } catch (error) {
    res.status(500).json({ error: 'Could not request exchange' });
  }
};



