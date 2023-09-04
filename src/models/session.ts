

import { boolean } from 'joi';
import { Schema, model } from 'mongoose';

interface Session {
    user_id: string;
    device_id: string;
    admin_id: string;
    status:boolean;
  }

const SessionSchema = new Schema<Session>({
  user_id: { type: String, ref: 'Customer', required: true },
  device_id: { type: String},
  admin_id: {type: String, ref: 'Admin', required: true },
  status: {type: Boolean, required:true}
});

export const SessionModel = model<Session>('Session', SessionSchema);
// export default SessionModel;