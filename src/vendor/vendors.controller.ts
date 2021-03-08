import { VendorsService } from './vendor.service';
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

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}
  @Get('orders')
  async fetchVendorOrders(@Res() res: Response, @Req() req: Request) {
    await this.vendorsService.fetchOrders(res, req);
  }
  // @Get('products')
  // async fetchVendorProducts(@Res() res: Response, @Req() req: Request) {
  //   await this.vendorsService.fetchProducts(res, req);
  // }
  @Post('signup')
  async createVendor(
    @Body('name') vendorName: string,
    @Body('email') vendorEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    await this.vendorsService.createVendor(res, vendorName, vendorEmail, password);
  }

  @Post('login')
  async loginVendor(
    @Body('email') vendorEmail: string,
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const data = await this.vendorsService.loginVendor(
      res,
      req,
      vendorEmail,
      password,
    );
    return data;
  }
}
