import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});

export interface User extends Document {
  id: string;
  name: string;
  email: string;
  orders: [mongoose.ObjectId];
  password: string;
}
