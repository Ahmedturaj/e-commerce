import AppError from "../../error/appError";
import catchAsync from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import User from "../user/user.model";
import { createProductService, deleteProductService, getAllProductsService, getMyProductsService, getProductByIdService, updateProductService } from "./product.service";

export const createProduct = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    if (!userId) {
        throw new AppError(401, "Unauthorized");
    }
    const product = await createProductService(req.body, userId);
    if (!product) {
        throw new AppError(400, "Product creation failed");
    }
    sendResponse(
        res, {
        statusCode: 201,
        success: true,
        message: 'Product created successfully',
        data: product,
    }
    );
});

export const updateProduct = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const { id: productId } = req.params;

    if (!userId) {
        throw new AppError(401, "Unauthorized");
    }

    if (!productId) {
        throw new AppError(400, "Product ID is required");
    }

    const updatedProduct = await updateProductService({ ...req.body, userId }, productId);

    if (!updatedProduct) {
        throw new AppError(404, "Product not found");
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
    });
});

export const getAllProducts = catchAsync(async (req, res) => {
    const { role: userRole } = req.user;
    if (userRole !== "admin") {
        throw new AppError(403, "Forbidden");
    }
    const products = await getAllProductsService();
    if (!products) {
        throw new AppError(404, "No Product Found");
    }
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: " Products fetched successfully",
        data: products
    })
});

export const getProductById = catchAsync(async (req, res) => {
    const { id: productId } = req.params;
    const { id: userId } = req.user;
    if (!productId) {
        throw new AppError(400, "Product ID is required");
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(401, "Unauthorized");
    }

    const product = await getProductByIdService(productId);
    if (!product) {
        throw new AppError(404, "Product not found");
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product fetched successfully",
        data: product
    })

});

export const getMyProducts = catchAsync(async (req, res) => {
    const { id: userId } = req.user;
    const myProducts = await getMyProductsService(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My Products fetched successfully",
        data: myProducts
    })

});

export const deleteProduct = catchAsync(async(req, res)=>{
    const {id:userId}= req.user;
    const {id:productId}=req.params;
    const deletedProduct = await deleteProductService(productId, userId);
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message:"product deleted successfully",
        data:deletedProduct
    })
})