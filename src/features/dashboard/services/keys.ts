export const dashboardKeys = {
	all: ["dashboard"] as const,
	overview: () => [...dashboardKeys.all, "overview"] as const,
	categories: () => [...dashboardKeys.all, "categories"] as const,
	products: () => [...dashboardKeys.all, "products"] as const,
};
