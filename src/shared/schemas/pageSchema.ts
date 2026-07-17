import z from "zod/v4";

export const createPageResponseSchema = <T extends z.ZodTypeAny>(
	itemSchema: T,
) =>
	z.object({
		items: z.array(itemSchema),
		totalElements: z.int().nonnegative(),
		totalPages: z.int().nonnegative(),
		page: z.int().nonnegative(),
		size: z.int().positive(),
	});

export type PageResponse<T extends z.ZodTypeAny> = z.infer<
	ReturnType<typeof createPageResponseSchema<T>>
>;
