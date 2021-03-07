import { UsersService } from './user.service';
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('orders')
  async fetchUserOrders(@Res() res: Response, @Req() req: Request) {
    await this.usersService.fetchOrders(res, req);
  }
  @Get('products')
  async fetchUserProducts(@Res() res: Response, @Req() req: Request) {
    await this.usersService.fetchProducts(res, req);
  }
  @Post('signup')
  async createUser(
    @Body('name') userName: string,
    @Body('email') userEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    await this.usersService.createUser(res, userName, userEmail, password);
  }

  @Post('login')
  async loginUser(
    @Body('email') userEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const data = await this.usersService.loginUser(
      res,
      req,
      userEmail,
      password,
    );
    return data;
  }
}
