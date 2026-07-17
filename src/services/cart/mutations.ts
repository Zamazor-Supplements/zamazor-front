// ==========================================
// MUTATIONS
// ==========================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGuestCartStore, type GuestCartItem } from "./GuestCartStore";
import { cartKeys } from "./queryKeys";
import { remoteCartService } from "./RemoteCartService";
import { checkIsLoggedIn, handleCartSuccess } from "./utils";
import { cartService } from "./api";

/**
 * Synchronize guest cart items with the server cart upon login.
 */
export function useSyncCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (items: GuestCartItem[]) => cartService.syncCart(items),
		onSuccess: (updatedCart) => {
			// Update the cart details cache directly with the response
			queryClient.setQueryData(cartKeys.details(true), updatedCart);
			// Invalidate summaries to trigger refetches
			queryClient.invalidateQueries({ queryKey: cartKeys.summaries() });
		},
	});
}

/**
 * Add an item to the cart.
 */
export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => {
			const isLoggedIn = checkIsLoggedIn();
			if (isLoggedIn) {
				return remoteCartService.addItem(productId, quantity);
			} else {
				// Triggers the Zustand reactive state cycle properly
				return useGuestCartStore.getState().addItem(productId, quantity);
			}
		},
		onSuccess: (updatedCart) => {
			handleCartSuccess(queryClient, checkIsLoggedIn(), updatedCart);
		},
	});
}

/**
 * Remove an item from the cart.
 */
export function useRemoveFromCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (productId: string) => {
			const isLoggedIn = checkIsLoggedIn();
			if (isLoggedIn) {
				return remoteCartService.removeItem(productId);
			} else {
				return useGuestCartStore.getState().removeItem(productId);
			}
		},
		onSuccess: (updatedCart) => {
			handleCartSuccess(queryClient, checkIsLoggedIn(), updatedCart);
		},
	});
}

/**
 * Update the quantity of a specific item in the cart.
 */
export function useUpdateCartItemQuantity() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => {
			const isLoggedIn = checkIsLoggedIn();
			if (isLoggedIn) {
				return remoteCartService.updateQuantity(productId, quantity);
			} else {
				return useGuestCartStore.getState().updateQuantity(productId, quantity);
			}
		},
		onSuccess: (updatedCart) => {
			handleCartSuccess(queryClient, checkIsLoggedIn(), updatedCart);
		},
	});
}

/**
 * Clear the authenticated cart completely.
 */
export function useClearCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const isLoggedIn = checkIsLoggedIn();
			if (isLoggedIn) {
				await remoteCartService.clear();
			} else {
				useGuestCartStore.getState().clear();
			}
		},
		onSuccess: () => {
			const isLoggedIn = checkIsLoggedIn();
			queryClient.setQueryData(cartKeys.details(isLoggedIn), []);

			if (isLoggedIn) {
				queryClient.invalidateQueries({ queryKey: cartKeys.all });
			}
		},
	});
}
