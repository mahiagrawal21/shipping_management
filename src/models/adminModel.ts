// adminModel.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Admin extends Document {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  
}

const adminSchema: Schema<Admin> = new Schema({
  username: { 
    type: String,
    required: true 
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
  
});

export const AdminModel = mongoose.model<Admin>('Admin', adminSchema);
