import z from "zod/v4";

export const addressSchema = z.object({
	id: z.uuid(),
	country: z.string().min(1),
	city: z.string().min(1),
	street: z.string().min(1),
	phone: z.string().min(1),
});

export type Address = z.infer<typeof addressSchema>;
export type AddressRequest = {
	country: string;
	city: string;
	street: string;
	phone: string;
};
