import express from "express"
import { ProductValidation } from "./product.validation";
import { createProduct } from "./product.controller";
import validationRequest from "../../middlewares/validationRequest";
const router = express.Router();


router.post("/create-product", validationRequest(ProductValidation.CreateProductSchema), createProduct);