import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { User } from './user.model';
import { Order } from '../orders/order.model';

import { generateToken } from '../../utils/generateToken.js';
import { version } from 'node:punycode';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>, // @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createUser(res, name: string, email: string, password: string) {
    try {
      let existingUser;
      try {
        existingUser = await this.userModel.findOne({ email });
      } catch (error) {
        throw new Error('Signup failed, please try again');
      }

      if (existingUser) {
        throw new Error('User already exists, Please login instead');
      }

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (error) {
        console.log(error);
        throw new Error('Could not create user, please try again.');
      }
      try {
        const newUser = new this.userModel({
          name,
          email,
          password: hashedPassword,
        });

        const result = await newUser.save();
        return res.json({
          result,
        });
      } catch (e) {
        throw new Error('Could not create user, please try again.');
      }
    } catch (error) {
      return res.status(500).json({
        messge: error.message,
      });
    }
  }

  async loginUser(res, req, email: string, password: string) {
    try {
      let userExists;
      try {
        userExists = await this.userModel.findOne({ email });
      } catch (error) {
        throw new Error('Error in user finding');
      }
      if (!userExists) {
        throw new Error('Invalid Email');
      }
      let isPasswordValid;
      try {
        console.log('PW', password, userExists);
        isPasswordValid = await bcrypt.compare(password, userExists.password);
      } catch (error) {
        console.log('ERROR', error);
        throw new Error('error in pw comparing');
      }

      if (!isPasswordValid) {
        throw new Error('Wrong pw');
      }

      req.user = {
        userExists,
      };

      return res.json({
        userExists,
        // id: userExists._id,
        // email: userExists.email,
        token: generateToken(userExists._id),
      });
    } catch (e) {
      return res.status(400).json({
        msg: e.message,
      });
    }
  }

  async fetchOrders(res, req) {
    const userId = req.body.data.userId;
    try {
      let user;
      try {
        user = await this.userModel.findById(userId).populate('orders');
      } catch (error) {
        throw new Error('Fetching orders failed, please try again');
      }
      if (!user) {
        throw new Error('Fetching orders failed, please try again');
      }
      res.json({ orders: user.orders });
    } catch (error) {
      return res.status(500).json({
        messge: error.message,
      });
    }
  }
}
