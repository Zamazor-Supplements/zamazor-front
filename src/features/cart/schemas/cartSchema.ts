import { productSchema } from "@/features/products/schemas/productSchema";
import z from "zod/v4";

const cartItemSchema = z.object({
	id: z.uuid(),
	product: productSchema,
	quantity: z.int().positive(),
});

export const populatedCartItemSchema = z.object({
	product: productSchema,
	quantity: z.number().nonnegative(),
});
export type PopulatedCartItem = z.infer<typeof populatedCartItemSchema>;

const baseCartSummary = z.object({
	items: z.array(populatedCartItemSchema),
	subtotal: z.number().nonnegative(),
	total: z.number().nonnegative(),
});

const guestCartSummarySchema = baseCartSummary.extend({
	tax: z.null(),
	shipping: z.null(),
	discount: z.null(),
});

const fullCartSummarySchema = baseCartSummary.extend({
	tax: z.number().nonnegative(),
	shipping: z.number().nonnegative(),
	discount: z.number().nonnegative(),
});

const cartSummarySchema = z.union([
	guestCartSummarySchema,
	fullCartSummarySchema,
]);
export type CartSummary = z.infer<typeof cartSummarySchema>;

export const cartSchema = z
	.object({
		id: z.uuid(),
		items: z.array(cartItemSchema),
	})
	.and(cartSummarySchema);
export type Cart = z.infer<typeof cartSchema>;
