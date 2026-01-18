import { Request, Response } from 'express';
import { stripe } from '../../config/stripe';
import Product from '../product/product.model';
import { Payment } from './payment.model';
import User from '../user/user.model';

export const createPayment = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.user.id; // auth middleware থেকে

  if (!productId) {
    return res.status(400).json({ message: 'productId is required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
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

  await Payment.create({
    userId,
    productId,
    amount,
    transactionId: paymentIntent.id,
    status: 'pending',
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
};


export const confirmPayment = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === 'succeeded') {
    await Payment.findOneAndUpdate(
      { transactionId: paymentIntentId },
      { status: 'success' }
    );

    return res.json({ success: true });
  }

  await Payment.findOneAndUpdate(
    { transactionId: paymentIntentId },
    { status: 'failed' }
  );

  res.status(400).json({ success: false });
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
