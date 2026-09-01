import z from "zod/v4";
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE } from "./validation";

export const requestPasswordResetSchema = z.object({
	email: z.email(),
});
export type RequestPasswordResetInput = z.infer<
	typeof requestPasswordResetSchema
>;

export const resetPasswordFormSchema = z
	.object({
		newPassword: z
			.string()
			.regex(PASSWORD_REGEX, PASSWORD_REQUIREMENTS_MESSAGE)
			.trim(),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;

export const resetPasswordSchema = z.object({
	token: z.string(),
	newPassword: z.string(),
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
