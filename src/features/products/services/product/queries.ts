import {
	useQuery,
	type UndefinedInitialDataOptions,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { Product, ProductPage } from "../../schemas/productSchema";
import {
	bulkProducts,
	getProductById,
	getProducts,
	getProductsByCategory,
	type ProductListQueryParams,
} from "./api";
import type { SystemError } from "@/shared/types";
import { productKeys } from "./keys";

export function useProducts<TData = ProductPage>(
	params: ProductListQueryParams = {},
	options?: Omit<
		UseQueryOptions<ProductPage, SystemError, TData>,
		"queryKey" | "queryFn"
	>,
) {
	return useQuery({
		queryKey: productKeys.list(params),
		queryFn: () => getProducts(params),
		...options,
	});
}

export function useProduct(id: string) {
	return useQuery({
		queryKey: productKeys.detail(id),
		queryFn: () => getProductById(id),
		enabled: !!id,
	});
}

export function useProductsByCategory(
	categoryId: string | undefined,
	params: ProductListQueryParams = {},
) {
	return useQuery({
		queryKey: productKeys.category(categoryId!, params),
		queryFn: () => getProductsByCategory(categoryId!, params),
		enabled: !!categoryId,
	});
}

export function useBulkProducts(
	ids: string[],
	options: Omit<
		UndefinedInitialDataOptions<Product[], SystemError, Product[]>,
		"queryKey" | "queryFn"
	> = {},
) {
	return useQuery({
		queryKey: productKeys.bulk(ids),
		queryFn: () => bulkProducts(ids),
		enabled: ids.length > 0,
		...options,
	});
}
