import mongoose from "mongoose";

export interface IProduct {
    userId: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    category: string;
}