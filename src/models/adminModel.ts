// adminModel.ts
import mongoose, { Schema, Document } from 'mongoose';

// export interface TrackingUpdate {
//   save(): unknown;
//   timestamp: Date;
//   location: string;
//   status: string;
// }


interface Admin extends Document {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  // trackingHistory?: TrackingUpdate[];
  
}

const adminSchema: Schema<Admin> = new Schema({
  username: { 
    type: String,
    required: false, 
    },
  email: { 
    type: String,
    required: true,
    unique: true 
   },
  password: { 
    type: String,
    required: true 
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  // trackingHistory: [
  //   {
  //     timestamp: {
  //       type: Date,
  //       // required: true,
  //     },
  //     location: {
  //       type: String,
  //       // required: true,
  //     },
  //     status: {
  //       type: String,
  //       // required: true,
  //     },
  //   },
  // ],
  
});

export const AdminModel = mongoose.model<Admin>('Admin', adminSchema);
