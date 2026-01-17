import AppError from "../../error/appError";
import catchAsync from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import Product from "./product.model";

export const createProduct = catchAsync(async (req, res) => {
    const product = await Product.create(req.body);
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
})