import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderSchema } from './order.model';
import { ProductSchema } from '../products/products.model';
import { VendorSchema } from '../vendor/vendor.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
