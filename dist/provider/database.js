"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const url = 'mongodb://localhost:27017';
const db = () => {
    // Connect to MongoDB
    mongoose_1.default.connect(url, {}).then(() => {
        console.log('Connected to MongoDB');
    })
        .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
};
exports.db = db;
//# sourceMappingURL=database.js.map