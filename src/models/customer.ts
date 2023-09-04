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
