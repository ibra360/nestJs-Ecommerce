import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const FoodItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export interface FoodItem extends Document {
  name: string;
  price: number;
  description: string;
  author: mongoose.ObjectId;
}
