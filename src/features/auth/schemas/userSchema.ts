import { addressSchema } from "@/features/addresses/schemas/addressSchema";
import { createPageResponseSchema } from "@/shared/schemas/pageSchema";
import { z } from "zod/v4";

export const roleSchema = z.enum(["USER", "MERCHANT", "ADMIN"]);
export type Role = z.infer<typeof roleSchema>;

export const userSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	fullName: z.string().min(2),
	address: addressSchema.nullable(),
	role: roleSchema,
});
export type User = z.infer<typeof userSchema>;

export const userPageSchema = createPageResponseSchema(userSchema);
export type UserPage = z.infer<typeof userPageSchema>;
