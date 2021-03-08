import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { VendorsService } from './vendor.service';
import { VendorsController } from './vendors.controller';
import { VendorSchema } from './vendor.model';
import { OrderSchema } from '../orders/order.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema }]),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
