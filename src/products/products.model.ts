import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  reviews: [Object],
  totalReviews: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export interface Product extends Document {
  name: string;
  price: number;
  description: string;
  reviews: [object];
  totalReviews: number;
  author: mongoose.ObjectId;
}
