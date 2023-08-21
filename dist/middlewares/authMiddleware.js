"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verify = void 0;
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const key = process.env.SECRET_KEY;
class Verify {
    static verify_token(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // const token = req.headers.authorization;
            console.log(token);
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, key);
                return decoded;
            }
            else {
                return false;
            }
        });
    }
}
exports.Verify = Verify;
Verify.verify_login_details = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(5).max(30).required()
});
//index.ts-code
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { User } from './src/models/user'; // Assuming you have a User model
// // Configure the local strategy for passport
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     // Find the user in your database based on the username
//     User.findOne({ username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: 'Invalid username' });
//       }
//       // Compare the provided password with the stored password
//       if (!user.comparePassword(password)) {
//         return done(null, false, { message: 'Invalid password' });
//       }
//       return done(null, user);
//     });
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// import passport from 'passport';
// import { Request, Response, NextFunction } from 'express';
// export function authenticate(req: Request, res: Response, next: NextFunction): void {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.status(401).json({ message: info.message });
//     }
//     req.logIn(user, (loginErr) => {
//       if (loginErr) {
//         return next(loginErr);
//       }
//       next();
//     });
//   })(req, res, next);
// }
//# sourceMappingURL=authMiddleware.js.map