import z from "zod/v4";
import { categorySchema } from "./categorySchema";
import { createPageResponseSchema } from "@/shared/schemas/pageSchema";

const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
];
/**
 * Customer review — all fields except author/rating/body are optional so the
 * backend can grow into them without breaking existing payloads.
 */
export const productReviewSchema = z.object({
	author: z.string().min(1),
	rating: z.number().min(0).max(5),
	date: z.string().optional(),
	body: z.string(),
	verified: z.boolean().optional(),
});
export type ProductReview = z.infer<typeof productReviewSchema>;

export const productSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1),
	description: z.string().nullable(),
	imageUrl: z.url(),
	price: z.number().positive(),
	stockQuantity: z.int().nonnegative(),
	reservedQuantity: z.int().nonnegative(),
	category: categorySchema,
	/* Optional enrichment fields — old API payloads without them still parse. */
	ingredients: z.array(z.string()).optional(),
	dosage: z.string().optional(),
	rating: z.number().min(0).max(5).optional(),
	reviews: z.array(productReviewSchema).optional(),
	createdAt: z.iso.datetime().pipe(z.coerce.date()),
	modifiedAt: z.iso.datetime().pipe(z.coerce.date()),
});
export type Product = z.infer<typeof productSchema>;

export const productPageSchema = createPageResponseSchema(productSchema);
export type ProductPage = z.infer<typeof productPageSchema>;

export const createProductSchema = z.object({
	name: z.string().trim().min(2).max(200),
	description: z.string().trim().max(200).optional(),
	price: z.coerce.number().positive(),
	stockQuantity: z.coerce.number().int().positive(),
	categoryId: z.uuid(),
	image: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			if (!file) return false; // Allow optional file
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, "Invalid image type. Please upload a JPEG, PNG, or GIF file."),
});
export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;

export const updateProductSchema = z.object({
	name: z.string().trim().min(2).max(200).optional(),
	description: z.string().trim().max(200).optional(),
	price: z.coerce.number().positive().optional(),
	stockQuantity: z.coerce.number().int().positive().optional(),
	categoryId: z.uuid().optional(),
	image: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			if (!file) return true; // Allow optional file
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, "Invalid image type. Please upload a JPEG, PNG, or GIF file."),
});
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type UpdateProductOutput = z.output<typeof updateProductSchema>;
