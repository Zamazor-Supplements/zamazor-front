import { useQuery } from "@tanstack/react-query";
import { getCategories, getOverview, getProducts } from "./api";
import { dashboardKeys } from "./keys";

export function useDashboardOverview() {
	return useQuery({
		queryKey: dashboardKeys.overview(),
		queryFn: getOverview,
	});
}

export function useDashboardCategories() {
	return useQuery({
		queryKey: dashboardKeys.categories(),
		queryFn: getCategories,
	});
}

export function useDashboardProducts() {
	return useQuery({
		queryKey: dashboardKeys.products(),
		queryFn: getProducts,
	});
}
