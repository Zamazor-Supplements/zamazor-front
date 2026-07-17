import z from "zod/v4";

export const categorySchema = z.object({
	id: z.uuid(),
	label: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
