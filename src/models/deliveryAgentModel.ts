import mongoose, { Schema, Document } from 'mongoose';

interface DeliveryAgent extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const deliveryAgentSchema: Schema<DeliveryAgent> = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const DeliveryAgentModel= mongoose.model<DeliveryAgent>('DeliveryAgent', deliveryAgentSchema);
