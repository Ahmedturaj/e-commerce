import mongoose from "mongoose";
import { IProduct } from "./product.interface";
import Product from "./product.model";
import User from "../user/user.model";
import AppError from "../../error/appError";

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
};

export const getMyProductsService = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(401, "Unauthorized");
  }

  const myProducts = await Product.find({ userId });

  if (!myProducts || myProducts.length === 0) {
    throw new AppError(404, "No Products Found");
  }

  return myProducts;
};

export const deleteProductService = async (productId:string, userId:string)=>{
    const user = await User.findById(userId);
    if(!user){
        throw new AppError(401, "Unauthorized");
    };

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
        throw new AppError(404, "Product not found");
    }
    return deletedProduct;
}
