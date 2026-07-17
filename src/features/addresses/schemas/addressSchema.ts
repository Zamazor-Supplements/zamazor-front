import z from "zod/v4";

export const addressRequestSchema = z.object({
	country: z.string().min(1),
	city: z.string().min(1),
	street: z.string().min(1),
	phone: z.string().min(1),
});

export const addressSchema = z.object({
	id: z.uuid(),
	country: z.string().min(1),
	city: z.string().min(1),
	street: z.string().min(1),
	phone: z.string().min(1),
});

export type Address = z.infer<typeof addressSchema>;
export type AddressRequest = z.infer<typeof addressRequestSchema>;
