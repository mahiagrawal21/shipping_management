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
exports.verifyAndRegisterUser = exports.forgotPassword = exports.LoginUser = exports.signup = exports.getCustomers = void 0;
const customer_1 = require("../models/customer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const sessionController_1 = require("./sessionController");
const session_1 = require("../models/session");
const redis_1 = require("redis");
//import {compare} from 'bcrypt';
const session_redis_1 = require("../middlewares/session.redis");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const client = (0, redis_1.createClient)();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();
// const redisClient = createClient();
// redisClient.on('error', (err) => console.error('Redis Error:', err));
// (redisClient as any).connect();
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield customer_1.CustomerModel.find();
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching customers' });
    }
});
exports.getCustomers = getCustomers;
//  CUSTOMER SIGNUP :-
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username: username, email: email, password: password } = req.body;
        const existingUser = yield customer_1.CustomerModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }
        const saltRounds = 8;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user_1 = new customer_1.CustomerModel({ username, email, password: hashedPassword });
        yield user_1.save();
        //  res.status(201).json(user_1);
        res.status(201).json({ message: "User Register Successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.signup = signup;
//CUSTOMER LOGIN:-
class LoginUser {
    static user_login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = req.body;
            try {
                const device = req.headers.device;
                yield authMiddleware_1.Verify.verify_login_details.validateAsync(details);
                const user = yield customer_1.CustomerModel.findOne({ email: details.email });
                console.log(user);
                if (user) {
                    const userSession = yield session_1.SessionModel.findOne({ user_id: user._id });
                    console.log(userSession);
                    if (!userSession || !userSession.status) {
                        const hash = user.password;
                        if (bcrypt_1.default.compare(details.password, hash)) {
                            const token = jsonwebtoken_1.default.sign({ email: details.email }, process.env.SECRET_KEY, { expiresIn: '2d' });
                            yield sessionController_1.Sessions.maintain_session(req, res, device, user, userSession);
                            yield session_redis_1.Redis.maintain_session_redis(user, device);
                            res.status(201).json({ message: "login successfully", isUser: user, token });
                            console.log(token);
                        }
                        else {
                            res.status(404).json({ message: "password is incorrect" });
                        }
                    }
                    else {
                        res.status(404).json({ message: "User is already active" });
                    }
                }
                else {
                    res.status(404).json({ status: "user not found" });
                }
            }
            catch (err) {
                res.status(500).json({ status: "Server Error" });
            }
        });
    }
}
exports.LoginUser = LoginUser;
//FORGOT PASSWORD 
class forgotPassword {
    static forgot_password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email: email } = req.body;
                //console.log(req.body);
                const user = yield customer_1.CustomerModel.findOne({ email });
                console.log(user);
                if (!user) {
                    return res.status(400).json({ message: 'Email not found' });
                }
                let OTP = Math.floor(1000 + Math.random() * 9000);
                client.set(email, OTP);
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_ADDRESS,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });
                const mailOptions = {
                    from: process.env.EMAIL_ADDRESS,
                    to: email,
                    subject: 'Password Reset Request',
                    text: ` Please click on the following link, or paste this into your browser to complete the process:\n\n
   ${process.env.CLIENT_URL}/RESET PASSWORD OTP: ${OTP}\n\n
   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Error sending email' });
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        return res.status(200).json({ message: 'Password reset link sent to email' });
                    }
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static reset_password(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, newPassword } = req.body;
                const user = yield customer_1.CustomerModel.findOne({ email });
                ;
                if (!user) {
                    return res.status(400).json({ message: 'Invalid User' });
                }
                const userOTP = yield client.get(email);
                console.log(userOTP);
                if (!userOTP || userOTP !== otp) {
                    return res.status(401).json({ error: 'Invalid OTP' });
                }
                //console.log(user.password);
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 2);
                user.password = hashedPassword;
                //user.password = await .generate_hash_pass(newPassword);
                console.log(user.password);
                yield user.save();
                return res.status(200).json({ message: 'Password reset successful' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.forgotPassword = forgotPassword;
//verification of user registration
const verifyAndRegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password, username } = req.body;
        // Check OTP validity
        const storedOTP = yield client.get(email);
        if (!storedOTP || storedOTP !== otp) {
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Replace this with your User creation logic
        const newUser = {
            email,
            password: hashedPassword,
            username,
        };
        // Replace this with your User saving logic
        // await newUser.save();
        // Delete OTP from Redis
        yield client.del(email);
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.verifyAndRegisterUser = verifyAndRegisterUser;
// export const verifyAndRegisterUser = async (ctx: Context) => {
//   const redisClient = createClient();
//   redisClient.on('error', (err) => console.error('Redis Error:', err));
//   await redisClient.connect();
//     try {
//       const { email, otp, password,name } = ctx.request.body as {
//         email: string;
//         otp: string;
//         password: string;
//         name:string
//       };
//       const storedOTP = await redisClient.get(email);
//       if (!storedOTP || storedOTP !== otp) {
//         ctx.status = 400;
//         ctx.body = { error: 'invalid OTP' };
//         return;
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({
//         email,
//         password: hashedPassword,
//         name,
//       });
//       await newUser.save();
//       await redisClient.del(email);
//       ctx.status = 201;
//       ctx.body = { message: 'user registered successfully.' };
//     } catch (error) {
//       console.error('error occurred:', error);
//       ctx.status = 500;
//       ctx.body = { error: 'An error occurred' };
//     }
//   };
// export const loginuser = async (req: Request, res: Response, next: NextFunction) => {
//  try {
//  const { username, password } = req.body;
//  const user_1 = await CustomerModel.findOne({ username: username });
//  if (!user_1) {
//  return res.status(404).json({ error: "User not found" });
//  }
//  const passwordMatch = await compare(password, user_1.password.toString());
//  if (!passwordMatch) {
//  throw new Error("email password not matched");
//  }
//  const session1 = new SessionModel({
//  user_id: user_1._id,
//  status: "Active",
//  expire_at: "1000"
//  });
//  await session1.save(); 
// await client.set(${user_1._id}_session, JSON.stringify(user_1));
//  const token = createToken(req);
// // res.send({token:token})
//  res.status(200).json({ message: 'Login successful' });
//  } catch (error) {
//  console.error("Login Error:", error);
//  res.status(500).json({ error: "An error occurred during login" });
//  }
// }; 
//# sourceMappingURL=customerController.js.map