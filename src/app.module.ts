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
import { ProductsModule } from './products/products.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ProductsModule,
    OrderModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ecommerce-backend.4zh4j.mongodb.net/store?retryWrites=true&w=majority`,
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
        { path: '/products/create', method: RequestMethod.POST },
        { path: '/products/review', method: RequestMethod.POST },
        { path: '/products/:pid', method: RequestMethod.DELETE },
        { path: '/order/create', method: RequestMethod.POST },
        { path: '/order/:oid', method: RequestMethod.DELETE },
        { path: '/users/orders', method: RequestMethod.GET },
        { path: '/users/products', method: RequestMethod.GET },
      );
  }
}
