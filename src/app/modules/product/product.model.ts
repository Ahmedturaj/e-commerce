
import mongoose from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new mongoose.Schema<IProduct>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }
}, {
    timestamps: true
});

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;