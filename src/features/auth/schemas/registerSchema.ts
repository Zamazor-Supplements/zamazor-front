import z from "zod/v4";
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from "./validation";

export const registerRequestSchema = z.object({
	fullName: z.string().min(2).trim(),
	email: z.email().trim(),
	password: z
		.string()
		.regex(PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE)
		.trim(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
