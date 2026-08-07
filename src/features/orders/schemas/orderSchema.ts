import { roleSchema } from "@/features/auth/schemas/userSchema";
import { createPageResponseSchema } from "@/shared/schemas/pageSchema";
import z from "zod/v4";
import { orderStatusSchema } from "../constants/orderStatus";

const productSnapshotSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	imageUrl: z.url().nullable(),
	price: z.number().positive(),
});

const userMinSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	fullName: z.string().min(1),
	role: roleSchema,
});

export const orderItemSchema = z.object({
	id: z.uuid(),
	product: productSnapshotSchema,
	quantity: z.int().positive(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
	id: z.uuid(),
	status: orderStatusSchema,
	subtotal: z.number().positive(),
	shippingCost: z.number().nonnegative(),
	discount: z.number().nonnegative(),
	tax: z.number().nonnegative(),
	total: z.number().positive(),
	items: z.array(orderItemSchema),
	shippingCountry: z.string().min(1),
	shippingCity: z.string().min(1),
	shippingStreet: z.string().min(1),
	phone: z.string().min(1),
	user: userMinSchema,
	createdAt: z.iso.datetime().pipe(z.coerce.date()),
});
export type Order = z.infer<typeof orderSchema>;

export const orderPageSchema = createPageResponseSchema(orderSchema);
export type OrderPage = z.infer<typeof orderPageSchema>;
