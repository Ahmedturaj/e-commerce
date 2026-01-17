import z from "zod";

const ProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    price: z.number().min(0),
    category: z.string().min(2).max(100),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

const UpdateProductSchema = ProductSchema.partial();
export const ProductValidation = {
    CreateProductSchema: ProductSchema,
    UpdateProductSchema,
};