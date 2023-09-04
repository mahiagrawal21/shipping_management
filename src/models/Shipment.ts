import mongoose, { Document, Schema } from 'mongoose';

interface IShipment extends Document {
  orderId: string;
  status: string;
 
  // Add other fields as needed
}

const ShipmentSchema = new Schema({
  orderId: String,
  status: String,
  location: String,
  // Define other fields and validation rules
});

const ShipmentModel = mongoose.model<IShipment>('Shipment', ShipmentSchema);

export default ShipmentModel;
