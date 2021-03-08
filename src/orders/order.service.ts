import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './order.model';
import { Vendor } from '../vendor/vendor.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly ordersModel: Model<Order>,
    @InjectModel('Vendor') private readonly vendorsModel: Model<Vendor>,
    
  ) {}

  async addOrders(orderItems, req, res) {
    let vendor;
    try {
      console.log("Vendor",req.body.data,orderItems)
      vendor = await this.vendorsModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating order failed, please try again');
    }

    if (!vendor) {
      throw new Error('There is no vendor with this ID');
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No orders');
    }

    const newOrder = new this.ordersModel({
      vendor: req.body.data.userId,
      orderItems,
    });
    try {
      const order = await newOrder.save();
      vendor.orders.push(order._id);
      await vendor.save();
      res.json({
        order,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }

  async getOrderById(req, res) {
    const orderId = req.params.oid;
    let order;
    try {
      order = await this.ordersModel.findById(orderId).populate('vendor');
    } catch (error) {
      throw new Error('No order found');
    }

    if (!order) {
      throw new Error('No order found');
    }

    try {
      res.json({
        order,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }

  deleteOrder = async (req, res) => {
    const orderId = req.params.oid;
    const authorId = req.body.data.userId;

    let vendor;

    try {
      console.log("oid aid",orderId,authorId)
      vendor = await this.vendorsModel.findById(authorId);
    } catch (error) {
      throw new Error("Can't delete this order");
    }

    if (!vendor) {
      throw new Error("Can't delete this order");
    }

    let order;

    try {
      order = await this.ordersModel.findById(orderId).populate('vendor');
    } catch (error) {
      throw new Error('No Order found');
    }
    if (!order || order.length === 0) {
      throw new Error('No Order found');
    }
    if (order.vendor.id !== authorId) {
      throw new Error('You are not allowed to delete this order');
    }

    try {
      // vendor.products.filter((pr) => pr !== product._id);
      // await vendor.save();
      console.log(order);
      console.log(vendor);
      order.vendor.orders.pull(order.id);
      await order.remove();
      await order.vendor.save();

      res.send({
        message: 'Order Deleted',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
