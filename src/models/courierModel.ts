import mongoose, { Schema, Document, Types } from 'mongoose';
import { CustomerModel } from './customer';
//import { DepartmentModel } from './department'; 
import { DeliveryAgentModel } from './deliveryAgentModel';
import { string } from 'joi';

interface ExchangeDetails {
  newPackageWeight: string;
}
export interface TrackingUpdate {
  save(): unknown;
  timestamp: Date;
  location: string;
  status: string;
}


interface Courier extends Document {
  // orderId:Types.ObjectId;
  senderDetails: Types.ObjectId;
  receiverDetails: Types.ObjectId;
  packageName: string;
  packageWeight: string;
  // tracker: { [key: string]: Types.ObjectId };
  tracker: string;
  deliveryAgent?: Types.ObjectId;
  departmentStatus?: 'accepted'|'out of delivery'|'dispatched'|'unsuccessful'|'delivered'
  // departmentStatus?: { [key: string]: string };
  status?: 'pending' | 'shipped' | 'delivered';
  location?: string;
  trackingHistory?: TrackingUpdate[];
  quantity?: number;
  pickupDate?: Date;
  deliveredDate?: Date;
  updatedAt: Date;
  createdAt: Date;
  
  returnStatus?: string, // New: 'Delivered', 'Returned', 'Exchanged', etc.
  returnReason?: string, // Reason for return
  exchangeDetails?: ExchangeDetails;
   

}

const courierSchema: Schema<Courier> = new Schema({
  // orderId:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   required: true,
  // },
  senderDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  receiverDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  packageName: {
    type: String,
    required: true,
  },
  packageWeight: {
    type: String,
    required: true,
  },
  tracker: {
    type: String,
    required:false
    // type: Object,
    // of: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'DeliveryAgent',
  },
  departmentStatus: {
    // type: Object, //{depId:status}
    type: String,
    enum: ['accepted','out of delivery','dispatched','unsuccessful','delivered'],
    required: true, //accepted, out of delivery, dispatched, unsuccessful, delivered
  },
  status: {
    type: String,
    enum: ['pending','shipped','delivered'],
    required: true,
  },
  location: {
      type:String,
      // required: true,
  },
  quantity :{
      type:Number,
      required: false,
  },
  trackingHistory: [
      {
        timestamp: {
          type: Date,
          // required: true,
        },
        location: {
          type: String,
          // required: true,
        },
        status: {
          type: String,
          // required: true,
        },
      },
    ],
  pickupDate: {
    type: Date,
    required: false,
  },
  deliveredDate: {
    type: Date,
    required: false,
  },
  returnStatus: {
    type: String,
    required: false,
  },
  returnReason: {
    type: String,
    required: false,
  },
  exchangeDetails: {
    type: Object, 
    required: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const CourierModel = mongoose.model<Courier>('Courier', courierSchema);





























// import mongoose, { Document, Schema } from 'mongoose';

// interface IParcel extends Document {
//   sender: CustomerDocument['_id'];
//   recipient: CustomerDocument['_id'];
//   dimensions: {
//     length: number;
//     width: number;
//     height: number;
//   };
//   // ... other fields
// }

// const parcelSchema: Schema<IParcel> = new Schema({
//   sender: {
//     type: Schema.Types.ObjectId,
//     ref: 'Customer',
//     required: true,
//   },
//   recipient: {
//     type: Schema.Types.ObjectId,
//     ref: 'Customer',
//     required: true,
//   },
//   dimensions: {
//     length: { type: Number, required: true },
//     width: { type: Number, required: true },
//     height: { type: Number, required: true },
//   },
//   // ... other fields
// });

// const Parcel = mongoose.model<IParcel>('Parcel', parcelSchema);

// export default Parcel;
