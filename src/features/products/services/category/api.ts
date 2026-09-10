import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import {
	categoriesSchema,
	categorySchema,
	type Category,
} from "../../schemas/categorySchema";
import { publicApiRequest } from "@/shared/utils/axiosPublic";
import { parseResponse } from "@/shared/utils/parseResponse";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";

export const getCategories = async () => {
	const response = await publicApiRequest<Category[]>({
		url: API_ENDPOINTS.CATEGORIES.ROOT,
		method: "GET",
	});

	return parseResponse(
		response,
		categoriesSchema,
		"Categories data validation failed",
	);
};

export const createCategory = async (label: string) => {
	const response = await privateApiRequest<Category>({
		url: API_ENDPOINTS.CATEGORIES.ROOT,
		method: "POST",
		data: { label },
	});

	return parseResponse(
		response,
		categorySchema,
		"Category data validation failed",
	);
};

export const updateCategory = async (id: string, label: string) => {
	const response = await privateApiRequest<Category>({
		url: API_ENDPOINTS.CATEGORIES.DETAILS(id),
		method: "PUT",
		data: { label },
	});

	return parseResponse(
		response,
		categorySchema,
		"Category data validation failed",
	);
};

export const deleteCategory = async (id: string) => {
	return await privateApiRequest<void>({
		url: API_ENDPOINTS.CATEGORIES.DETAILS(id),
		method: "DELETE",
	});
};
