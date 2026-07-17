import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import type { PageQueryParams } from "./productService";
import { publicApiRequest } from "@/shared/utils/axiosPublic";
import { categorySchema, type Category } from "../schemas/categorySchema";
import z from "zod/v4";

export const categoryService = {
	getCategories: async (params: PageQueryParams = {}) => {
		const response = await publicApiRequest<Category[]>({
			url: API_ENDPOINTS.CATEGORIES.ROOT,
			method: "GET",
			params,
		});

		const parsed = z.array(categorySchema).safeParse(response);
		if (!parsed.success) {
			throw new Error("category data validation failed: ", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	createCategory: async (label: string) => {
		const response = await privateApiRequest<Category>({
			url: API_ENDPOINTS.CATEGORIES.ROOT,
			method: "POST",
			data: { label },
		});

		const parsed = categorySchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("category data validation failed: ", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	updateCategory: async (id: string, label: string) => {
		const response = await privateApiRequest<Category>({
			url: API_ENDPOINTS.CATEGORIES.DETAILS(id),
			method: "PUT",
			data: { label },
		});

		const parsed = categorySchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("category data validation failed: ", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	deleteCategory: async (id: string) => {
		return await privateApiRequest<void>({
			url: API_ENDPOINTS.CATEGORIES.DETAILS(id),
			method: "DELETE",
		});
	},
};
