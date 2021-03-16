import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { FoodItemsService } from './foodItems.service';
import { FoodItemsController } from './foodItems.controller';
import { FoodItemSchema } from './foodItems.model';
import { VendorSchema } from '../vendor/vendor.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'FoodItems', schema: FoodItemSchema }]),
    MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema }]),
  ],
  controllers: [FoodItemsController],
  providers: [FoodItemsService],
})
export class FoodItemsModule {}
