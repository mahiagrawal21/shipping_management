import mongoose, { Schema, Document } from 'mongoose';

interface Department extends Document {
  name: string;
  registrationNumber: string;
  password: string;
  location: string;
  contactNumber: string;
  contactEmail: string;
  city: string;
  state: string;
  pinCode: number;
  country: string;
}

const departmentSchema: Schema<Department> = new Schema({
  name: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    default: 'New Delhi',
  },
  state: {
    type: String,
    required: true,
    default: 'Delhi',
  },
  pinCode: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'India',
  },
});

export const DepartmentModel= mongoose.model<Department>('Department', departmentSchema);
