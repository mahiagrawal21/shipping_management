import { Request, Response } from 'express';
import Review,  {IReview}  from '../models/review';
import {CourierModel} from '../models/courierModel'; // Assuming you have an Order model
import { SessionModel } from '../models/session';
import { CustomerModel } from '../models/customer';
//import { CustomerModel } from '../models/customer';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { customerId, courierId, rating, feedback } = req.body;
    //const existingUser = await CustomerModel.findOne({_id:customerId});

    // Check if the order exists and is associated with the courier
    const order = await CourierModel.findOne({ _id:  courierId }).exec();
    if (!order) {
      return res.status(404).json({ message: 'Order not found or not associated with the courier' });
    }

    const newReview: IReview = new Review({
      customerId,
      courierId,
      rating,
      feedback,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getReviewsByCourier = async (req: Request, res: Response) => {
    try {
      const { courierId } = req.params;
      const reviews = await Review.find({ courierId }).exec();
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  