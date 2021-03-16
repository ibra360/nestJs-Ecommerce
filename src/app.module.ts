import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { LoggerMiddleware } from './middlewares/checkAuth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/user.module';
import { VendorsModule } from './vendor/vendor.module';
import { FoodItemsModule } from './foodItems/foodItems.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    VendorsModule,
    FoodItemsModule,
    OrderModule,
    // MongooseModule.forRoot(
    //   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ecommerce-backend.4zh4j.mongodb.net/store?retryWrites=true&w=majority`,
    // ),
    MongooseModule.forRoot(
      process.env.MDB_URL
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: '/foodItems/create', method: RequestMethod.POST },
        { path: '/foodItems/review', method: RequestMethod.POST },
        { path: '/foodItems/:pid', method: RequestMethod.DELETE },
        { path: '/order/create', method: RequestMethod.POST },
        { path: '/order/:oid', method: RequestMethod.DELETE },
        { path: '/users/orders', method: RequestMethod.GET },
        { path: '/users/foodItems', method: RequestMethod.GET },
      );
  }
}
