import type { ProductListQueryParams } from "./api";

export const productKeys = {
	all: ["products"] as const,
	lists: () => [...productKeys.all, "list"] as const,
	list: (params: ProductListQueryParams = {}) =>
		[...productKeys.lists(), params] as const,
	details: () => [...productKeys.all, "detail"] as const,
	detail: (id: string) => [...productKeys.details(), id] as const,
	category: (categoryId: string, params: ProductListQueryParams = {}) =>
		[...productKeys.all, "category", categoryId, params] as const,
	bulk: (ids: string[]) => [...productKeys.lists(), "bulk", ids] as const,
};
