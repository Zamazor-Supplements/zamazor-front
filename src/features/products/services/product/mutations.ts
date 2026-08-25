import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, updateProduct } from "./api";
import { productKeys } from "./keys";
import type { Product, UpdateProductOutput } from "../../schemas/productSchema";
import { categoryKeys } from "../category/keys";
import type { Category } from "../../schemas/categorySchema";
import { dashboardKeys } from "@/features/dashboard/services/keys";

export function useCreateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProduct,
		onSuccess: (product) => {
			queryClient.setQueryData(productKeys.detail(product.id), product);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: productKeys.lists(),
			});
			queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
		},
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProductOutput }) =>
			updateProduct(id, data),
		onMutate: async ({ id, data }) => {
			await queryClient.cancelQueries({ queryKey: productKeys.detail(id) }); // Cancel outgoing refetches so they don't overwrite optimistic update
			const previous = queryClient.getQueryData<Product>(
				productKeys.detail(id),
			);
			const categories = queryClient.getQueryData<Category[]>(
				categoryKeys.lists(),
			);
			const selectedCategory = categories?.find(
				(c) => c.id === data.categoryId,
			);

			queryClient.setQueryData<Product>(productKeys.detail(id), (current) => {
				if (!current) return undefined;
				const updated: Partial<Product> = {
					...(data.name && { name: data.name }),
					...(data.description && { description: data.description }),
					...(data.price && { price: data.price }),
					...(data.stockQuantity && { stockQuantity: data.stockQuantity }),
					...(selectedCategory && { category: selectedCategory }),
					...(data.image && { imageUrl: URL.createObjectURL(data.image) }),
				};
				return { ...current, ...updated };
			});
			return { previous };
		},

		onSuccess: (product) => {
			queryClient.setQueryData(productKeys.detail(product.id), product);
		},
		onError: (error, variables, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(
				productKeys.detail(variables.id),
				context?.previous,
			); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
		},
	});
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProduct,
		onMutate: (productId) => {
			const previous = queryClient.getQueryData<Product[]>(productKeys.lists());
			queryClient.removeQueries({
				queryKey: productKeys.detail(productId),
			});
			return { previous };
		},
		onSuccess: (_, id) => {
			queryClient.removeQueries({
				queryKey: productKeys.detail(id),
			});
		},
		onError: (error, productId, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(
				productKeys.detail(productId),
				context?.previous,
			); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: productKeys.lists() });
			queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
		},
	});
}
