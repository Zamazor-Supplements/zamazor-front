import { parseResponse } from "@/shared/utils/parseResponse";
import {
	categoryAnalyticsSchema,
	dashboardOverviewSchema,
	productAnalyticsSchema,
	type CategoryAnalytics,
	type DashboardOverview,
	type ProductAnalytics,
} from "../schemas/dashboardSchema";
import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";

export const getOverview = async () => {
	const response = await privateApiRequest<DashboardOverview>({
		url: API_ENDPOINTS.DASHBOARD.OVERVIEW,
		method: "GET",
	});

	return parseResponse(
		response,
		dashboardOverviewSchema,
		"Dashboard overview data validation failed",
	);
};
export const getCategories = async () => {
	const response = await privateApiRequest<CategoryAnalytics>({
		url: API_ENDPOINTS.DASHBOARD.CATEGORY,
		method: "GET",
	});

	return parseResponse(
		response,
		categoryAnalyticsSchema,
		"Category analytics data validation failed",
	);
};

export const getProducts = async () => {
	const response = await privateApiRequest<ProductAnalytics>({
		url: API_ENDPOINTS.DASHBOARD.PRODUCT,
		method: "GET",
	});

	return parseResponse(
		response,
		productAnalyticsSchema,
		"Product analytics data validation failed",
	);
};
