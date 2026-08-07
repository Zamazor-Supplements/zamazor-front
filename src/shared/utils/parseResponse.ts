import type z from "zod/v4";

export function parseResponse<T>(
	response: unknown,
	schema: z.ZodSchema<T>,
	message = "Response validation failed",
): T {
	const parsed = schema.safeParse(response);

	if (!parsed.success) {
		throw new Error(message, {
			cause: parsed.error,
		});
	}

	return parsed.data;
}
