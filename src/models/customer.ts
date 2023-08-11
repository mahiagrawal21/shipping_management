import mongoose, { Schema, Document } from 'mongoose';
//import bcrypt from 'bcrypt';

export interface CustomerDocument extends Document {
  customer_name: string;
  phone_number: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  email: string;
  password: string;
  //comparePassword(candidatePassword: string): Promise<boolean>;
}

const CustomerSchema: Schema<CustomerDocument> = new Schema({
  customer_name: { type: String, required: true},
  phone_number: { type: String, required: true },
  password: {type: String, required: true},
  location: { type:String, required: true},
  city: {type:String, required: true },
  state: {type:String, required:true},
  pincode: {type:String, required:true},
  country: {type: String, required:true},
  email: { type: String, required: true, unique: true },
});

// // Hash the password before saving the user
// UserSchema.pre<UserDocument>('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

// // Compare the provided password with the stored hashed password
// UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

export const CustomerModel =  mongoose.model<CustomerDocument>('Customer', CustomerSchema);
