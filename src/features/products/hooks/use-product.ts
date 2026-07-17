import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	productService,
	type PageQueryParams,
	type ProductListQueryParams,
} from "../services/productService";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { ProductPage } from "../schemas/productSchema";
import type { SystemError } from "@/shared/types";

export const useProductsQuery = <TData = ProductPage>(
	params: ProductListQueryParams = {},
	options?: Omit<
		UseQueryOptions<ProductPage, SystemError, TData>,
		"queryKey" | "queryFn"
	>,
) => {
	return useQuery({
		queryKey: ["products", "list", params],
		queryFn: () => productService.getProducts(params),
		...options,
	});
};

export const useBulkProductsQuery = (
	productIds: string[],
	params: PageQueryParams = {},
) => {
	return useQuery({
		queryKey: ["products", "bulk", { productIds, params }],
		queryFn: () => productService.bulkProducts(productIds, params),
		enabled: productIds.length > 0, // Avoid unnecessary calls if the array is empty
	});
};

export const useProductByIdQuery = (id: string) => {
	return useQuery({
		queryKey: ["products", "detail", id],
		queryFn: () => productService.getProductById(id),
		enabled: !!id, // Only run the query if an ID is actually provided
	});
};

export const useProductsByCategoryQuery = (
	categoryId: string | undefined,
	params: ProductListQueryParams = {},
) => {
	return useQuery({
		queryKey: ["products", "category", categoryId, params],
		queryFn: () => productService.getProductsByCategory(categoryId, params),
		enabled: !!categoryId,
	});
};

// --- MUTATIONS ---

export const useCreateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (formData: FormData) => productService.createProduct(formData),
		onSuccess: () => {
			// Invalidate product lists so the UI updates automatically
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
};

export const useUpdateProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
			productService.updateProduct(id, formData),
		onSuccess: (_data, variables) => {
			// Invalidate both the list and the specific product detail cache
			queryClient.invalidateQueries({ queryKey: ["products", "list"] });
			queryClient.invalidateQueries({
				queryKey: ["products", "detail", variables.id],
			});
		},
	});
};

export const useDeleteProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productService.deleteProduct(id),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: ["products", "list"] });
			queryClient.invalidateQueries({ queryKey: ["products", "detail", id] });
		},
	});
};
