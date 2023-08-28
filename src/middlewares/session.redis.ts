import redis from "redis";
import { createClient } from "redis";
import  { CustomerDocument, CustomerModel, } from '../models/customer';
//import { authenticateToken } from "./auth";
//import { Verify } from "./auth.user";

const client = createClient();
client.connect();
client.on('error', err => console.log('Redis client error', err));


export class Redis{
  static removeTokenFromRedis(email: any) {
    throw new Error('Method not implemented.');
  }
    static get_otp: any;
  static save_otp: any;
    static async maintain_session_redis(user,device){
        //await client.connect();
        //client.on('error', err => console.log('Redis client error', err));
        try{
            if(user){
                await client.SET(user.username, JSON.stringify({
                    'user_id': user._id,
                    'device_id': device,
                    'status': true
                }));
                const session = await client.get(user.username);
                console.log(session);
            }
            else{
                console.log("User not found");
            }
        }
        catch(err){
            console.log(err);
        }
    }
}

// // static async logout_session_redis(client:any, User:any) {
// //     console.log(User.email);
// //     try {
// //         // console.log(user.username);
// //         await client.del(User.email);
// //         // const redisSessions = await client.get(user.username);
// //         console.log("delete successfully");
// //     }
// //     catch (err) {
// //         console.log("error in deleting", err);
// //     }
// // }
// // }
