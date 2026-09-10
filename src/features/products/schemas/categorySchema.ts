import z from "zod/v4";

export const categorySchema = z.object({
	id: z.uuid(),
	label: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoriesSchema = z.array(categorySchema);

export const createCategorySchema = z.object({
	label: z.string().trim().min(1),
});
export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
