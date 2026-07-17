import z from "zod";
import { categorySchema } from "./categorySchema";
import { createPageResponseSchema } from "@/shared/schemas/pageSchema";

export const productSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	description: z.string().nullable(),
	imageUrl: z.url(),
	price: z.number().positive(),
	stockQuantity: z.int().nonnegative(),
	reservedQuantity: z.int().nonnegative(),
	category: categorySchema,
	createdAt: z.iso.datetime().pipe(z.coerce.date()),
	modifiedAt: z.iso.datetime().pipe(z.coerce.date()),
});

export type Product = z.infer<typeof productSchema>;

export const productPageSchema = createPageResponseSchema(productSchema);
export type ProductPage = z.infer<typeof productPageSchema>;
