import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
});

export interface Order extends Document {
  user: mongoose.ObjectId;
  orderItems: [
    {
      name: string;
      qty: number;
      price: number;
      product: mongoose.ObjectId;
    },
  ];
}
