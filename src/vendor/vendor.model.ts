import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  foodItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
    },
  ],
});

export interface Vendor extends Document {
  id: string;
  name: string;
  email: string;
  foodItems: [mongoose.ObjectId];
  password: string;
}
