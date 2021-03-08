import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { Vendor } from './vendor.model';
import { Order } from '../orders/order.model';

import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel('Vendor') private readonly vendorModel: Model<Vendor>,
    // @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async createVendor(res, name: string, email: string, password: string) {
    try {
      let existingVendor;
      try {
        existingVendor = await this.vendorModel.findOne({ email });
      } catch (error) {
        throw new Error('Signup failed, please try again');
      }

      if (existingVendor) {
        throw new Error('Vendor already exists, Please login instead');
      }

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (error) {
        console.log(error);
        throw new Error('Could not create vendor, please try again.');
      }
      try {
        const newVendor = new this.vendorModel({
          name,
          email,
          password: hashedPassword,
        });

        const result = await newVendor.save();
        return res.json({
          id: result._id,
          email: result.email,
          name: result.name,
          token: generateToken(result._id),
        });
      } catch (e) {
        throw new Error('Could not create vendor, please try again.');
      }
    } catch (error) {
      return res.status(500).json({
        messge: error.message,
      });
    }
  }

  async loginVendor(res, req, email: string, password: string) {
    try {
      let vendorExists;
      try {
        vendorExists = await this.vendorModel.findOne({ email });
      } catch (error) {
        throw new Error('Error in vendor finding');
      }
      if (!vendorExists) {
        throw new Error('Invalid Email');
      }
      let isPasswordValid;
      try {
        console.log("PW",password,vendorExists)
        
        isPasswordValid = await bcrypt.compare(password, vendorExists.password);
      } catch (error) {
        console.log("ERROR",error)
        throw new Error('error in pw comparing');
      }
      
      if (!isPasswordValid) {
        throw new Error('Wrong pw');
      }

      req.vendor = {
        vendorExists,
      };

      return res.json({
        id: vendorExists._id,
        email: vendorExists.email,
        token: generateToken(vendorExists._id),
      });
    } catch (e) {
      return res.status(400).json({
        msg: e.message,
      });
    }
  }

  async fetchOrders(res, req) {
    const vendorId = req.body.data.vendorId;

    try {
      let vendor;
      try {
        vendor = await this.vendorModel.findById(vendorId).populate('orders');
      } catch (error) {
        throw new Error('Fetching orders failed, please try again');
      }

      if (!vendor) {
        throw new Error('Fetching orders failed, please try again');
      }

      res.json({ orders: vendor.orders });
    } catch (error) {
      return res.status(500).json({
        messge: error.message,
      });
    }
  }

  
  
}
