import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import {
	productPageSchema,
	productSchema,
	type CreateProductOutput,
	type Product,
	type ProductPage,
	type UpdateProductOutput,
} from "../../schemas/productSchema";
import { publicApiRequest } from "@/shared/utils/axiosPublic";
import type { PageQueryParams } from "@/shared/types/page";
import { parseResponse } from "@/shared/utils/parseResponse";

export interface ProductListQueryParams extends PageQueryParams {
	q?: string | undefined;
	categoryId?: string | undefined;
	minPrice?: number | undefined;
	maxPrice?: number | undefined;
	sort?: string | string[] | undefined;
}

export const getProducts = async (params: ProductListQueryParams = {}) => {
	const response = await publicApiRequest<ProductPage>({
		url: API_ENDPOINTS.PRODUCTS.ROOT,
		method: "GET",
		params,
	});

	return parseResponse(
		response,
		productPageSchema,
		"Products data validation failed",
	);
};

export const bulkProducts = async (productIds: string[]) => {
	if (productIds.length === 0) return [] satisfies Product[];

	const response = await publicApiRequest<ProductPage>({
		url: API_ENDPOINTS.PRODUCTS.BULK,
		method: "POST",
		data: { ids: productIds },
	});

	return parseResponse(
		response,
		productPageSchema,
		"Products data validation failed",
	).items;
};

export const getProductById = async (id: string) => {
	const response = await publicApiRequest<Product>({
		url: API_ENDPOINTS.PRODUCTS.DETAILS(id),
		method: "GET",
	});

	return parseResponse(
		response,
		productSchema,
		"Product data validation failed",
	);
};

export const getProductsByCategory = async (
	categoryId: string,
	params: ProductListQueryParams = {},
) => {
	const response = await publicApiRequest<ProductPage>({
		url: API_ENDPOINTS.PRODUCTS.CATEGORY(categoryId),
		method: "GET",
		params,
	});

	return parseResponse(
		response,
		productPageSchema,
		"Products data validation failed",
	);
};

export const createProduct = async (data: CreateProductOutput) => {
	const formData = new FormData();
	formData.append("name", data.name.trim());
	formData.append("description", data.description?.trim() ?? "");
	formData.append("price", data.price.toString());
	formData.append("stockQuantity", data.stockQuantity.toString());
	formData.append("categoryId", data.categoryId);
	if (data.image) formData.append("image", data.image);

	const response = await privateApiRequest<Product>({
		url: API_ENDPOINTS.PRODUCTS.ROOT,
		method: "POST",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return parseResponse(
		response,
		productSchema,
		"Product data validation failed",
	);
};

export const updateProduct = async (id: string, data: UpdateProductOutput) => {
	const formData = new FormData();
	if (data.name) formData.append("name", data.name.trim());
	if (data.description)
		formData.append("description", data.description?.trim() ?? "");
	if (data.price) formData.append("price", data.price.toString());
	if (data.stockQuantity)
		formData.append("stockQuantity", data.stockQuantity.toString());
	if (data.categoryId) formData.append("categoryId", data.categoryId);
	if (data.image) {
		formData.append("image", data.image);
	}

	const response = await privateApiRequest<Product>({
		url: API_ENDPOINTS.PRODUCTS.DETAILS(id),
		method: "PUT",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return parseResponse(
		response,
		productSchema,
		"Product data validation failed",
	);
};

export const deleteProduct = async (id: string) => {
	return await privateApiRequest<void>({
		url: API_ENDPOINTS.PRODUCTS.DETAILS(id),
		method: "DELETE",
	});
};
