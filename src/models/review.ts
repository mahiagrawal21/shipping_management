import mongoose, { Schema, Document } from 'mongoose';
import { CustomerDocument } from '../models/customer';


export interface IReview extends Document {
//   orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId |CustomerDocument;
  courierId: mongoose.Types.ObjectId;
  rating: number;
  feedback: string;
//   timestamp: Date;
}

const reviewSchema: Schema = new Schema({
//   orderId: {type:Schema.Types.ObjectId, required: true},
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer',required: true },
  courierId: { type: Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IReview>('Review', reviewSchema);

