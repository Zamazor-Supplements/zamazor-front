import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { publicApiRequest } from "@/shared/utils/axiosPublic";
import {
	productPageSchema,
	productSchema,
	type Product,
	type ProductPage,
} from "../schemas/productSchema";

export interface PageQueryParams {
	page?: number;
	size?: number;
}

export interface ProductListQueryParams extends PageQueryParams {
	q?: string;
	categoryId?: string;
	minPrice?: number;
	maxPrice?: number;
	sort?: string | string[];
}

export const productService = {
	getProducts: async (params: ProductListQueryParams = {}) => {
		const response = await publicApiRequest<ProductPage>({
			url: API_ENDPOINTS.PRODUCTS.ROOT,
			method: "GET",
			params,
		});

		const parsed = productPageSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Product data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	bulkProducts: async (productIds: string[], params: PageQueryParams = {}) => {
		if (productIds.length === 0) return [] satisfies Product[];

		const response = await publicApiRequest<ProductPage>({
			url: API_ENDPOINTS.PRODUCTS.BULK,
			method: "POST",
			params,
			data: { ids: productIds },
		});

		const parsed = productPageSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Product data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data.items;
	},

	getProductById: async (id: string) => {
		const response = await publicApiRequest<Product>({
			url: API_ENDPOINTS.PRODUCTS.DETAILS(id),
			method: "GET",
		});

		const parsed = productSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Product data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	getProductsByCategory: async (
		categoryId: string = "",
		params: ProductListQueryParams = {},
	) => {
		const response = await publicApiRequest<ProductPage>({
			url: API_ENDPOINTS.PRODUCTS.CATEGORY(categoryId),
			method: "GET",
			params,
		});

		const parsed = productPageSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Product data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	createProduct: async (formData: FormData) => {
		const response = await privateApiRequest<Product>({
			url: API_ENDPOINTS.PRODUCTS.ROOT,
			method: "POST",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const parsed = productSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Product data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	updateProduct: async (id: string, formData: FormData) => {
		const response = await privateApiRequest<Product>({
			url: API_ENDPOINTS.PRODUCTS.DETAILS(id),
			method: "PUT",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const parsed = productSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Product data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	deleteProduct: async (id: string) => {
		return await privateApiRequest<void>({
			url: API_ENDPOINTS.PRODUCTS.DETAILS(id),
			method: "DELETE",
		});
	},
};
