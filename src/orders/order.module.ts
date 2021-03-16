import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from './order.model';
import { FoodItemSchema } from '../foodItems/foodItems.model';
import { UserSchema } from '../users/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'FoodItem', schema: FoodItemSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
