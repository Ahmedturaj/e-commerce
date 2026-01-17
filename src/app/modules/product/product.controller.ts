import AppError from "../../error/appError";
import catchAsync from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import { createProductService } from "./product.service";

export const createProduct = catchAsync(async(req,res)=>{
    const { id: userId } = req.user;
    if(!userId){
        throw new AppError(401,"Unauthorized");
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
})