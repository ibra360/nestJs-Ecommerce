import { FoodItemsService } from './foodItems.service';
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

@Controller('foodItems')
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}
  @Get('')
  async getAllFoodItems(@Req() req: Request, @Res() res: Response) {
    try {
      await this.foodItemsService.getAllFoodItems(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
  @Get(':pid')
  async getFoodItemById(@Req() req: Request, @Res() res: Response) {
    try {
      await this.foodItemsService.getFoodItemById(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }

  @Get('/author/:aid')
  async getFoodItemsByAuthorId(@Req() req: Request, @Res() res: Response) {
    try {
      await this.foodItemsService.getFoodItemsByAuthorId(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }

 
  @Post('create')
  async createFoodItem(
    @Body('name') name: string,
    @Body('description') desc: string,
    @Body('amount') amount: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.foodItemsService.createFoodItem(name, desc, amount, req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }

  

  @Delete(':pid')
  async deleteFoodItem(@Req() req: Request, @Res() res: Response) {
    try {
      await this.foodItemsService.deleteFoodItem(req, res);
    } catch (error) {
      res.send({
        message: error.message,
      });
    }
  }
}
