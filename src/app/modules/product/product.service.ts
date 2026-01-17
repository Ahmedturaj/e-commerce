import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import Product from "./product.model";

export const createProductService= async(ProductData:IProduct, userId: mongoose.Schema.Types.ObjectId)=>{
    const product = await Product.create({...ProductData, userId});
    return product;
}

export const updateProductService=async(productData:IProduct,productId:mongoose.Schema.Types.ObjectId)=>{
    const product = await Product.findByIdAndUpdate(productId, productData, { new: true });
    return product;
}