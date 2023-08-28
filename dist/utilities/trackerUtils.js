"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomTrackerID = void 0;
// src/utilities/trackerUtils.ts
function generateRandomTrackerID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let trackerID = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        trackerID += characters.charAt(randomIndex);
    }
    return trackerID;
}
exports.generateRandomTrackerID = generateRandomTrackerID;
//# sourceMappingURL=trackerUtils.js.map