import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { FoodItem } from './foodItems.model';
import { Vendor } from '../vendor/vendor.model';

import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class FoodItemsService {
  constructor(
    @InjectModel('FoodItems') private readonly foodItemsModel: Model<FoodItem>,
    @InjectModel('Vendor') private readonly vendorsModel: Model<Vendor>,
  ) {}

  async getAllFoodItems(req, res) {
    let foodItems;
    try {
      foodItems = await this.foodItemsModel.find();
    } catch (error) {
      throw new Error('Fetching foodItems failed, please try again');
    }

    if (foodItems.length > 0) {
      return res.json({
        foodItems,
      });
    }
    res.json({
      foodItems: 'No foodItems found',
    });
  }

  async getFoodItemById(req, res) {
    const foodItemId = req.params.pid;

    let foodItem;
    try {
      foodItem = await this.foodItemsModel.findById(foodItemId).populate('author');
    } catch (error) {
      throw new Error('Could not find foodItem with the provided ID');
    }
    if (!foodItem) {
      throw new Error('Could not find a foodItem with the provided foodItem id');
    }
    res.json({ foodItem });
  }

  getFoodItemsByAuthorId = async (req, res) => {
    const authorId = req.params.aid;
    let foodItems;
    try {
      foodItems = await this.foodItemsModel.find({ author: authorId });
    } catch (error) {
      throw new Error('Could not find foodItem with the provided authorID');
    }
    if (!foodItems || foodItems.length === 0) {
      throw new Error('Could not find a foodItem with the provided authorID');
    }
    res.json({
      foodItems: foodItems.map((place) => place.toObject({ getters: true })),
    });
  };

  getAllFoodItemReviews = async (req, res) => {
    const foodItemId = req.params.pid;
    let foodItem;
    try {
      foodItem = await this.foodItemsModel.findById(foodItemId);
    } catch (error) {
      throw new Error('Could not find foodItem with the provided ID');
    }
    if (!foodItem || foodItem.length === 0) {
      throw new Error('Could not find a foodItem with the provided ID');
    }
    res.json({
      reviews: foodItem.reviews,
      totalReviews: foodItem.totalReviews,
    });
  };

  async createFoodItem(name: string, desc: string, amount: number, req, res) {
    let vendor;
    try {
      console.log("food req.body.data=",req.body.data)
      vendor = await this.vendorsModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating foodItem failed, please try again');
    }

    if(!vendor){
      res.status(500).send({
        message: "Vendor not found with this id",
      });
    }
    const newFoodItem = new this.foodItemsModel({
      name,
      description: desc,
      price: amount,
      author: req.body.data.userId,
    });
    try {
      const foodItem = await newFoodItem.save();
      vendor.foodItems.push(foodItem._id);
      await vendor.save();
      res.json({ 
        foodItem,       
      });
    } catch (error) {
      res.status(500).send({
        message: "Error in pushing fooditem",
      });
    }
  }

  postReview = async (pid, review, rating, req, res) => {
    const authorId = req.body.data.userId;

    let author;
    try {
      author = await this.vendorsModel.findById(authorId);
    } catch (error) {
      console.log(error);
      throw new Error('No vendor found with the given id');
    }

    if (!author || author.length === 0) {
      throw new Error('No vendor found with the given id');
    }

    if (!author.foodItems || author.foodItems.length === 0) {
      throw new Error("You can't review this foodItem until you purchase");
    }

    let isFoodItem = false;

    author.foodItems.map(async (prod) => {
      if (prod === pid) {
        isFoodItem = true;
      }
    });

    if (isFoodItem) {
      let foodItem;
      try {
        foodItem = await this.foodItemsModel.findById(pid);
      } catch (error) {
        throw new Error('No foodItem found with the given id');
      }

      if (!foodItem || foodItem.length === 0) {
        throw new Error('No foodItem found with the given id');
      }

      if (rating < 0 || rating > 5) {
        throw new Error('Rating must be between 1 to 5');
      }

      foodItem.totalReviews = foodItem.reviews?.length || 0;
      foodItem.reviews = [
        ...foodItem.reviews,
        { review, rating, author: author.name },
      ];
      foodItem.totalReviews = foodItem.reviews.length;

      try {
        await foodItem.save();
        return res.json({
          foodItem,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }

    throw new Error("You can't review this foodItem until you purchase");
  };

  deleteFoodItem = async (req, res) => {
    const foodItemId = req.params.pid;
    const authorId = req.body.data.userId;

    let vendor;

    try {
      vendor = await this.vendorsModel.findById(authorId);
    } catch (error) {
      throw new Error("Can't delete this foodItem");
    }

    if (!vendor) {
      throw new Error("Can't delete this foodItem");
    }

    let foodItem;

    try {
      foodItem = await this.foodItemsModel.findById(foodItemId).populate('author');
    } catch (error) {
      throw new Error('No FoodItem found');
    }
    if (!foodItem || foodItem.length === 0) {
      throw new Error('No FoodItem found');
    }
    if (foodItem.author.id !== authorId) {
      throw new Error('You are not allowed to delete this place');
    }

    try {
      // vendor.foodItems.filter((pr) => pr !== foodItem._id);
      // await vendor.save();
      console.log(foodItem.id);
      foodItem.author.foodItems.pull(foodItem.id);
      await foodItem.remove();
      await foodItem.author.save();

      res.send({
        message: 'FoodItem Deleted',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
