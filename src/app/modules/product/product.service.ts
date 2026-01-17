import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import Product from "./product.model";

export const createProductService = async (ProductData: IProduct, userId: string) => {
    const product = await Product.create({ ...ProductData, userId });
    return product;
};

export const updateProductService = async (productData: IProduct, productId: string) => {
    const product = await Product.findByIdAndUpdate(productId, productData, { new: true });
    return product;
};

export const getAllProductsService = async () => {
    const products = await Product.find();
    return products;
};

export const getProductByIdService = async (productId: string)=>{
    const product = await Product.findById(productId);
    return product;
}