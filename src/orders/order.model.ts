import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  vendor: {
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
      OrderStatus: { enum: ['cooking', 'omv', 'Delivered'], required: false },
      qty: {
        type: Number,
        required: false,
      },
      price: {
        type: Number,
        required: true,
      },
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FoodItem',
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
      foodItem: mongoose.ObjectId;
    },
  ];
}
