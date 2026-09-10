import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, updateCategory } from "./api";
import { categoryKeys } from "./keys";
import type { Category } from "../../schemas/categorySchema";

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCategory,
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: categoryKeys.lists(),
			});
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, label }: { id: string; label: string }) =>
			updateCategory(id, label),
		onMutate: (target) => {
			const previous = queryClient.getQueryData<Category[]>(
				categoryKeys.lists(),
			);
			queryClient.setQueryData(
				categoryKeys.lists(),
				(current: Category[] | undefined) => {
					return current?.map((category) =>
						category.id === target.id ? target : category,
					);
				},
			);
			return { previous };
		},
		onSuccess: (category) => {
			queryClient.setQueryData(categoryKeys.detail(category.id), category);
		},
		onError: (error, _variables, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(categoryKeys.lists(), context?.previous); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategory,
		onMutate: (targetId) => {
			const previous = queryClient.getQueryData<Category[]>(
				categoryKeys.lists(),
			);
			queryClient.setQueryData(
				categoryKeys.lists(),
				(current: Category[] | undefined) => {
					return current?.filter((category) => category.id !== targetId);
				},
			);
			return { previous };
		},
		onSuccess: (_, targetId) => {
			queryClient.removeQueries({
				queryKey: categoryKeys.detail(targetId),
			});
		},
		onError: (error, _variables, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(categoryKeys.lists(), context?.previous); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
		},
	});
}
