import { Types } from 'mongoose';

export interface IPayment {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    amount: number;
    transactionId: string;
    status: 'pending' | 'success' | 'failed';
}
