import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';
const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
