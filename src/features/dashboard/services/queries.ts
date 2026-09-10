import { useQuery } from "@tanstack/react-query";
import { getCategoryMetrics, getOverviewMetrics, getProductMetricss } from "./api";
import { dashboardKeys } from "./keys";

export function useDashboardOverview() {
	return useQuery({
		queryKey: dashboardKeys.overview(),
		queryFn: getOverviewMetrics,
	});
}

export function useDashboardCategories() {
	return useQuery({
		queryKey: dashboardKeys.categories(),
		queryFn: getCategoryMetrics,
	});
}

export function useDashboardProducts() {
	return useQuery({
		queryKey: dashboardKeys.products(),
		queryFn: getProductMetricss,
	});
}
