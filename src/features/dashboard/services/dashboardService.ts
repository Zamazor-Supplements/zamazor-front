import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import {
	categoryAnalyticsSchema,
	dashboardOverviewSchema,
	productAnalyticsSchema,
	type CategoryAnalytics,
	type DashboardOverview,
	type ProductAnalytics,
} from "../schemas/dashboardSchema";

export const dashboardService = {
	getOverview: async () => {
		const response = await privateApiRequest<DashboardOverview>({
			url: API_ENDPOINTS.DASHBOARD.OVERVIEW,
			method: "GET",
		});

		const parsed = dashboardOverviewSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error(
				"Dashboard overview data validation failed:",
				parsed.error,
			);
		}
		return parsed.data;
	},
	getCategories: async () => {
		const response = await privateApiRequest<CategoryAnalytics>({
			url: API_ENDPOINTS.DASHBOARD.CATEGORY,
			method: "GET",
		});

		const parsed = categoryAnalyticsSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error(
				"Category analytics data validation failed:",
				parsed.error,
			);
		}
		return parsed.data;
	},
	getProducts: async () => {
		const response = await privateApiRequest<ProductAnalytics>({
			url: API_ENDPOINTS.DASHBOARD.PRODUCT,
			method: "GET",
		});

		const parsed = productAnalyticsSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error(
				"Product analytics data validation failed:",
				parsed.error,
			);
		}
		return parsed.data;
	},
};
