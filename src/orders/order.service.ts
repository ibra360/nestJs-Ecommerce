import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './order.model';
import { User } from '../users/user.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly ordersModel: Model<Order>,
    @InjectModel('User') private readonly usersModel: Model<User>,
  ) {}

  async addOrders(orderItems, req, res) {
    let user;
    try {
      console.log('User', req.body.data, orderItems);
      user = await this.usersModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating order failed, please try again');
    }

    if (!user) {
      throw new Error('There is no user with this ID');
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No orders');
    }

    const newOrder = new this.ordersModel({
      user: req.body.data.userId,
      orderItems,
    });
    try {
      const order = await newOrder.save();
      user.orders.push(order._id);
      await user.save();
      res.json({
        order,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }

  async updateOrders(orderItems, id, req, res) {
    let user;
    try {
      console.log('User', req.body.data, orderItems);
      user = await this.usersModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating order failed, please try again');
    }
    if (!user) {
      throw new Error('There is no user with this ID');
    }

    if (!orderItems || orderItems.length === 0) {
      throw new Error('No orders');
    }

    var updateOrder = await this.ordersModel.findById(id);
    if (!updateOrder) {
      res.status(400).send({
        message: 'Order not found by this id',
      });
    }
    const newOrder = new this.ordersModel({
      user: req.body.data.userId,
      orderItems,
    });
    try {
      const order = await newOrder.save();
      user.orders.push(order._id);
      await user.save();
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
      order = await this.ordersModel.findById(orderId).populate('user');
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

    let user;

    try {
      console.log('oid aid', orderId, authorId);
      user = await this.usersModel.findById(authorId);
    } catch (error) {
      throw new Error("Can't delete this order");
    }

    if (!user) {
      throw new Error("Can't delete this order");
    }

    let order;

    try {
      order = await this.ordersModel.findById(orderId).populate('user');
    } catch (error) {
      throw new Error('No Order found');
    }
    if (!order || order.length === 0) {
      throw new Error('No Order found');
    }
    if (order.user.id !== authorId) {
      throw new Error('You are not allowed to delete this order');
    }

    try {
      // user.foodItems.filter((pr) => pr !== foodItem._id);
      // await user.save();
      console.log(order);
      console.log(user);
      order.user.orders.pull(order.id);
      await order.remove();
      await order.user.save();

      res.send({
        message: 'Order Deleted',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
