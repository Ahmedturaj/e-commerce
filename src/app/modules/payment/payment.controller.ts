import { Request, Response } from 'express';
import { stripe } from '../../config/stripe';
import Product from '../product/product.model';
import { Payment } from './payment.model';
import User from '../user/user.model';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../error/appError';

// export const createPayment = async (req: Request, res: Response) => {
//   const { productId } = req.body;
//   const userId = req.user.id; 

//   if (!productId) {
//     return res.status(400).json({ message: 'productId is required' });
//   }

//   const product = await Product.findById(productId);
//   if (!product) {
//     return res.status(404).json({ message: 'Product not found' });
//   }

//   const amount = product.price;

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Math.round(amount * 100),
//     currency: 'usd',
//     metadata: {
//       userId,
//       productId,
//     },
//   });

//   await Payment.create({
//     userId,
//     productId,
//     amount,
//     transactionId: paymentIntent.id,
//     status: 'pending',
//   });

//   res.status(200).json({
//     success: true,
//     clientSecret: paymentIntent.client_secret,
//   });
// };

export const createPayment = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) {
    return sendResponse(res, {
      statusCode: 400,
      success: true,
      message: 'productId is required',
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return sendResponse(res, {
      statusCode: 404,
      success: true,
      message: 'Product not found',
    });
  }

  const amount = product.price;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    metadata: {
      userId,
      productId,
    },
  });

  const payment = await Payment.create({
    userId,
    productId,
    amount,
    transactionId: paymentIntent.id,
    status: 'pending',
  });

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment intent created successfully',
    data: {
      clientSecret: paymentIntent.client_secret,
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
      },
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
      },
    },
  });
};


// export const confirmPayment = async (req: Request, res: Response) => {
//   const { paymentIntentId } = req.body;

//   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//   if (paymentIntent.status === 'succeeded') {
//     await Payment.findOneAndUpdate(
//       { transactionId: paymentIntentId },
//       { status: 'success' }
//     );

//     return res.json({ success: true });
//   }

//   await Payment.findOneAndUpdate(
//     { transactionId: paymentIntentId },
//     { status: 'failed' }
//   );

//   res.status(400).json({ success: false });
// };


export const confirmPayment = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  if (!paymentIntentId) {
    throw new AppError(400, 'paymentIntentId is required');
  }

  // Stripe expects pi_... not Mongo _id
  if (!paymentIntentId.startsWith('pi_')) {
    throw new AppError(
      400,
      'Invalid paymentIntentId. Stripe paymentIntentId must start with "pi_"'
    );
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    throw new AppError(404, 'PaymentIntent not found in Stripe');
  }

  const status =
    paymentIntent.status === 'succeeded' ? 'success' : 'failed';

  const payment = await Payment.findOneAndUpdate(
    { transactionId: paymentIntentId },
    { status },
    { new: true }
  );

  if (!payment) {
    throw new AppError(404, 'Payment record not found in database');
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      status === 'success'
        ? 'Payment confirmed successfully'
        : 'Payment failed',
    data: {
      paymentId: payment._id,
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
      stripeStatus: paymentIntent.status,
    },
  });
};


export const createStripeConnectAccount = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    user.stripeAccountId = account.id;
    await user.save();
  }

  const accountLink = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: `${process.env.FRONTEND_URL}/connect/refresh`,
    return_url: `${process.env.FRONTEND_URL}/stripe-success`,
    type: 'account_onboarding',
  });

  res.json({ url: accountLink.url });
};
