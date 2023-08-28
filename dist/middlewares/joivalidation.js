"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJoiSchema = void 0;
// Middleware for Joi validation
const validateJoiSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};
exports.validateJoiSchema = validateJoiSchema;
//# sourceMappingURL=joivalidation.js.map