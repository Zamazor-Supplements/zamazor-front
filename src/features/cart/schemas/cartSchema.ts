import { productSchema } from "@/features/products/schemas/productSchema";
import { createPageResponseSchema } from "@/shared/schemas/pageSchema";
import z from "zod/v4";

export const cartItemSchema = z.object({
	id: z.uuid(),
	product: productSchema,
	quantity: z.int().positive(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

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
export type GuestCartSummary = z.infer<typeof guestCartSummarySchema>;

const fullCartSummarySchema = baseCartSummary.extend({
	tax: z.number().nonnegative(),
	shipping: z.number().nonnegative(),
	discount: z.number().nonnegative(),
});

export const cartSummarySchema = z.union([
	guestCartSummarySchema,
	fullCartSummarySchema,
]);
export type CartSummary = z.infer<typeof cartSummarySchema>;

export const cartSchema = z
	.object({
		id: z.uuid(),
		items: z.array(cartItemSchema),
		subtotal: z.number().nonnegative(),
	})
	.and(cartSummarySchema);
export type Cart = z.infer<typeof cartSchema>;

export const cartPageSchema = createPageResponseSchema(cartSchema);
export type CartPage = z.infer<typeof cartPageSchema>;
