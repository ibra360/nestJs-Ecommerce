import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcryptjs');

import { Product } from './products.model';
import { User } from '../users/user.model';

import { generateToken } from '../../utils/generateToken.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productsModel: Model<Product>,
    @InjectModel('User') private readonly usersModel: Model<User>,
  ) {}

  async getAllProducts(req, res) {
    let products;
    try {
      products = await this.productsModel.find();
    } catch (error) {
      throw new Error('Fetching products failed, please try again');
    }

    if (products.length > 0) {
      return res.json({
        products,
      });
    }
    res.json({
      products: 'No products found',
    });
  }

  async getProductById(req, res) {
    const productId = req.params.pid;

    let product;
    try {
      product = await this.productsModel.findById(productId).populate('author');
    } catch (error) {
      throw new Error('Could not find product with the provided ID');
    }
    if (!product) {
      throw new Error('Could not find a product with the provided product id');
    }
    res.json({ product });
  }

  getProductsByAuthorId = async (req, res) => {
    const authorId = req.params.aid;
    let products;
    try {
      products = await this.productsModel.find({ author: authorId });
    } catch (error) {
      throw new Error('Could not find product with the provided authorID');
    }
    if (!products || products.length === 0) {
      throw new Error('Could not find a product with the provided authorID');
    }
    res.json({
      products: products.map((place) => place.toObject({ getters: true })),
    });
  };

  getAllProductReviews = async (req, res) => {
    const productId = req.params.pid;
    let product;
    try {
      product = await this.productsModel.findById(productId);
    } catch (error) {
      throw new Error('Could not find product with the provided ID');
    }
    if (!product || product.length === 0) {
      throw new Error('Could not find a product with the provided ID');
    }
    res.json({
      reviews: product.reviews,
      totalReviews: product.totalReviews,
    });
  };

  async createProduct(name: string, desc: string, amount: number, req, res) {
    let user;
    try {
      user = await this.usersModel.findById(req.body.data.userId);
    } catch (error) {
      throw new Error('Creating product failed, please try again');
    }

    const newProduct = new this.productsModel({
      name,
      description: desc,
      price: amount,
      author: req.body.data.userId,
    });
    try {
      const product = await newProduct.save();
      user.products.push(product._id);
      await user.save();
      res.json({
        id: product._id,
        author: product.author,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  }

  postReview = async (pid, review, rating, req, res) => {
    const authorId = req.body.data.userId;

    let author;
    try {
      author = await this.usersModel.findById(authorId);
    } catch (error) {
      console.log(error);
      throw new Error('No user found with the given id');
    }

    if (!author || author.length === 0) {
      throw new Error('No user found with the given id');
    }

    if (!author.products || author.products.length === 0) {
      throw new Error("You can't review this product until you purchase");
    }

    let isProduct = false;

    author.products.map(async (prod) => {
      if (prod === pid) {
        isProduct = true;
      }
    });

    if (isProduct) {
      let product;
      try {
        product = await this.productsModel.findById(pid);
      } catch (error) {
        throw new Error('No product found with the given id');
      }

      if (!product || product.length === 0) {
        throw new Error('No product found with the given id');
      }

      if (rating < 0 || rating > 5) {
        throw new Error('Rating must be between 1 to 5');
      }

      product.totalReviews = product.reviews?.length || 0;
      product.reviews = [
        ...product.reviews,
        { review, rating, author: author.name },
      ];
      product.totalReviews = product.reviews.length;

      try {
        await product.save();
        return res.json({
          product,
        });
      } catch (error) {
        throw new Error(error.message);
      }
    }

    throw new Error("You can't review this product until you purchase");
  };

  deleteProduct = async (req, res) => {
    const productId = req.params.pid;
    const authorId = req.body.data.userId;

    let user;

    try {
      user = await this.usersModel.findById(authorId);
    } catch (error) {
      throw new Error("Can't delete this product");
    }

    if (!user) {
      throw new Error("Can't delete this product");
    }

    let product;

    try {
      product = await this.productsModel.findById(productId).populate('author');
    } catch (error) {
      throw new Error('No Product found');
    }
    if (!product || product.length === 0) {
      throw new Error('No Product found');
    }
    if (product.author.id !== authorId) {
      throw new Error('You are not allowed to delete this place');
    }

    try {
      // user.products.filter((pr) => pr !== product._id);
      // await user.save();
      console.log(product.id);
      product.author.products.pull(product.id);
      await product.remove();
      await product.author.save();

      res.send({
        message: 'Product Deleted',
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
