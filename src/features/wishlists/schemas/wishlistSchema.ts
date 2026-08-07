import { productSchema } from "@/features/products/schemas/productSchema";
import z from "zod/v4";

export const wishlistItemSchema = z.object({
	id: z.uuid(),
	product: productSchema,
	createdAt: z.iso.datetime().pipe(z.coerce.date()),
});

export const wishlistSchema = z.object({
	items: z.array(wishlistItemSchema),
});
export type Wishlist = z.infer<typeof wishlistSchema>;
