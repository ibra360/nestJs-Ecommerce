import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const VendorSchema = new mongoose.Schema({
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

export interface Vendor extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  orders: [mongoose.ObjectId];
}
