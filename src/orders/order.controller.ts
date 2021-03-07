import { OrderService } from './order.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':oid')
  async getOrderById(@Req() req: Request, @Res() res: Response) {
    try {
      await this.orderService.getOrderById(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }

  @Post('create')
  async addToCart(
    @Body('orderItems') orderItems: [],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.orderService.addOrders(orderItems, req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }

  @Delete(':oid')
  async deleteOrder(@Req() req: Request, @Res() res: Response) {
    try {
      await this.orderService.deleteOrder(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
}
