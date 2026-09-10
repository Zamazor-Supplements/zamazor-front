import { productSchema } from "@/features/products/schemas/productSchema";
import z from "zod/v4";

export const guestItemSchema = z.object({
	id: z.null(),
	product: productSchema,
	quantity: z.int().positive(),
});
export type GuestItem = z.infer<typeof guestItemSchema>;

const cartItemSchema = z.object({
	id: z.uuid().nullable(),
	product: productSchema,
	quantity: z.int().positive(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

const baseCartSummary = z.object({
	id: z.uuid().nullable(), // id is null when Cart is not in DB
	items: z.array(cartItemSchema),
	subtotal: z.number().nonnegative(),
	total: z.number().nonnegative(),
});

const guestCartSchema = baseCartSummary.extend({
	id: z.null(),
	tax: z.null(),
	shipping: z.null(),
	discount: z.null(),
});
export type GuestCart = z.infer<typeof guestCartSchema>;

const fullCartSchema = baseCartSummary.extend({
	id: z.uuid(),
	tax: z.number().nonnegative(),
	shipping: z.number().nonnegative(),
	discount: z.number().nonnegative(),
});

export const cartSchema = z.union([guestCartSchema, fullCartSchema]);
export type Cart = z.infer<typeof cartSchema>;
