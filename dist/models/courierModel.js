"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourierModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const courierSchema = new mongoose_1.Schema({
    senderDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer',
    },
    receiverDetails: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        // type: Object,
        // of: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department' },
    },
    deliveryAgent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
        ref: 'DeliveryAgent',
    },
    // departmentStatus: {
    //   type: Object,
    //   required: true,
    // },
    status: {
        type: String,
        required: true,
    },
    pickupDate: {
        type: Date,
        required: false,
    },
    deliveredDate: {
        type: Date,
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
exports.CourierModel = mongoose_1.default.model('Courier', courierSchema);
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
//# sourceMappingURL=courierModel.js.map