import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

// Query Key Factory for clean cache management
export const dashboardKeys = {
	all: ["dashboard"] as const,
	overview: () => [...dashboardKeys.all, "overview"] as const,
	categories: () => [...dashboardKeys.all, "categories"] as const,
	products: () => [...dashboardKeys.all, "products"] as const,
};

// ==========================================
// CUSTOM HOOKS
// ==========================================

export function useDashboardOverview() {
	return useQuery({
		queryKey: dashboardKeys.overview(),
		queryFn: dashboardService.getOverview,
	});
}

export function useDashboardCategories() {
	return useQuery({
		queryKey: dashboardKeys.categories(),
		queryFn: dashboardService.getCategories,
	});
}

export function useDashboardProducts() {
	return useQuery({
		queryKey: dashboardKeys.products(),
		queryFn: dashboardService.getProducts,
	});
}
