import type { Product } from "@/features/products/schemas/productSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistKeys } from "./keys";
import { clearWishlist, syncWishlist, toggleWishlist } from "./api";
import { useGuestWishlistStore } from "../stores/guestWishlistStore";
import { useIsAuthenticated } from "@/features/auth/services/queries";

export function useSyncWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: syncWishlist,

		onSuccess: (wishlist) => {
			queryClient.setQueryData(wishlistKeys.all, wishlist);
		},
	});
}

function useGuestToggleWishlist() {
	const toggleGuest = useGuestWishlistStore((s) => s.toggleItem);

	return useMutation({
		mutationFn: async (product: Product) => toggleGuest(product.id),
	});
}

function useAuthenticatedToggleWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (product: Product) => toggleWishlist(product.id),
		onMutate: (target) => {
			const previous = queryClient.getQueryData<Product[]>(wishlistKeys.all);
			queryClient.setQueryData(wishlistKeys.all, (current: Product[]) => {
				const exists = current.some((product) => product.id === target.id);

				return exists
					? current.filter((product) => product.id !== target.id)
					: [...current, target];
			});
			return { previous };
		},
		onSuccess: (data) => {
			queryClient.setQueryData(wishlistKeys.all, data);
		},
		onError: (error, _variables, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(wishlistKeys.all, context?.previous); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
		},
	});
}

export function useToggleWishlist() {
	const authenticated = useIsAuthenticated();
	const guestToggleMutation = useGuestToggleWishlist();
	const authenticatedToggleMutation = useAuthenticatedToggleWishlist();

	return authenticated ? authenticatedToggleMutation : guestToggleMutation;
}

function useGuestClearWishlist() {
	const clearGuest = useGuestWishlistStore((s) => s.clear);

	return useMutation({
		mutationFn: clearGuest,
	});
}

function useAuthenticatedClearWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: clearWishlist,
		onMutate: () => {
			const previous = queryClient.getQueryData<Product[]>(wishlistKeys.all);
			queryClient.setQueryData(wishlistKeys.all, undefined);
			return { previous };
		},
		onSuccess: (data) => {
			queryClient.setQueryData(wishlistKeys.all, data);
		},
		onError: (error, _variables, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(wishlistKeys.all, context?.previous); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
		},
	});
}

export function useClearWishlist() {
	const authenticated = useIsAuthenticated();
	const guestClearMutation = useGuestClearWishlist();
	const authenticatedClearMutation = useAuthenticatedClearWishlist();

	return authenticated ? authenticatedClearMutation : guestClearMutation;
}
