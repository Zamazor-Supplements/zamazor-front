import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PageQueryParams } from "../services/productService";
import { categoryService } from "../services/categoryService";

// --- QUERIES ---

export const useCategoriesQuery = (params: PageQueryParams = {}) => {
	return useQuery({
		queryKey: ["categories", "list", params],
		queryFn: () => categoryService.getCategories(params),
	});
};

// --- MUTATIONS ---

export const useCreateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (label: string) => categoryService.createCategory(label),
		onSuccess: () => {
			// Invalidate categories cache to trigger automatic background update
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};

export const useUpdateCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, label }: { id: string; label: string }) =>
			categoryService.updateCategory(id, label),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};

export const useDeleteCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => categoryService.deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
};
