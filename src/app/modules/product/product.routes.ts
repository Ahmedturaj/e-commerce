import express from "express"
import { ProductValidation } from "./product.validation";
import { createProduct, updateProduct } from "./product.controller";
import validationRequest from "../../middlewares/validationRequest";
import auth from "../../middlewares/auth";
import { userRole } from "../user/user.constant";
const router = express.Router();


router.post("/create-product",auth(userRole.admin, userRole.contractor, userRole.user), validationRequest(ProductValidation.CreateProductSchema), createProduct);

router.put("/update-product/:id",auth(userRole.admin, userRole.contractor, userRole.user), validationRequest(ProductValidation.UpdateProductSchema), updateProduct)

const productRoutes = router;
export default productRoutes;