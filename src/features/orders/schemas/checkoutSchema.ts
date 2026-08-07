import { z } from "zod";

export const checkoutSchema = z.object({
	street: z.string().min(1),
	city: z.string().min(1),
	phone: z.string().min(1),
	country: z.string().min(1),
	isDefault: z.boolean(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
// export type CheckoutRequest = {
// 	country: string;
// 	city: string;
// 	street: string;
// 	phone: string;
// 	isDefault: boolean;
// };
