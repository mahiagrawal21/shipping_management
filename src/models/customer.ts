import mongoose, { Schema, Document } from 'mongoose';
//import bcrypt from 'bcrypt';

export interface CustomerDocument extends Document {
  username: string;
  phone_number: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  email: string;
  password: string;
  reviews: Array<string>;
  //comparePassword(candidatePassword: string): Promise<boolean>;
}

export const CustomerSchema: Schema<CustomerDocument> = new Schema({
  username: { type: String, required: true},
  phone_number: { type: String, required: false },
  password: {type: String, required: true},
  location: { type:String, required: false},
  city: {type:String, required: false },
  state: {type:String, required:false},
  pincode: {type:String, required:false},
  country: {type: String, required:false},
  email: { type: String, required: true, unique: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],

})
export const CustomerModel =  mongoose.model<CustomerDocument>('Customer', CustomerSchema);
