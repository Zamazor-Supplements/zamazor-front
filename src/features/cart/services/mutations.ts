import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	useGuestCartStore,
	type GuestCartItem,
} from "../stores/guestCartStore";
import { cartKeys } from "./keys";
// import { handleCartSuccess } from "./utils";
import type { Cart, PopulatedCartItem } from "../schemas/cartSchema";
import {
	addToCart,
	clearCart,
	removeFromCart,
	syncCart,
	updateCartItemQuantity,
} from "./api";
import { useIsAuthenticated } from "@/features/auth/services/queries";

function useAuthenticatedCartMutation<TVariables>(
	mutationFn: (variables: TVariables) => Promise<Cart>,
) {
	const queryClient = useQueryClient();
	const authenticated = useIsAuthenticated();

	return useMutation({
		mutationFn,
		onSuccess: (updatedCart) => {
			if (!authenticated) return;
			if (updatedCart) {
				queryClient.setQueryData(cartKeys.all, updatedCart);
			} else {
				queryClient.invalidateQueries({
					queryKey: cartKeys.all,
				});
			}

			queryClient.invalidateQueries({
				queryKey: ["cart", "summary"],
			});
		},
	});
}

/**
 * Synchronize guest cart items with the server cart upon login.
 */
export function useSyncCart() {
	return useAuthenticatedCartMutation(syncCart);
}

function useGuestAddToCart() {
	const guestAddItem = useGuestCartStore((s) => s.addItem);

	return useMutation({
		mutationFn: async ({ product, quantity }: PopulatedCartItem) =>
			guestAddItem(product.id, quantity),
	});
}

function useAuthenticatedAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ product, quantity }: PopulatedCartItem) =>
			addToCart(product.id, quantity),
		onSuccess: (data) => {
			queryClient.setQueryData(cartKeys.all, data);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: cartKeys.all });
		},
	});
}

/**
 * Add an item to the cart.
 */
export function useAddToCart() {
	const authenticated = useIsAuthenticated();
	const guestAddItemMutation = useGuestAddToCart();
	const authenticatedAddItemMutation = useAuthenticatedAddToCart();

	return authenticated ? authenticatedAddItemMutation : guestAddItemMutation;
}

/**
 * Remove an item from the cart.
 */
export function useRemoveFromCart() {
	const authenticated = useIsAuthenticated();
	const guestRemoveItem = useGuestCartStore((s) => s.removeItem);

	const authenticatedMutation = useAuthenticatedCartMutation(removeFromCart);

	const guestMutation = useMutation({
		mutationFn: guestRemoveItem,
	});

	return authenticated ? authenticatedMutation : guestMutation;
}

/**
 * Update the quantity of a specific item in the cart.
 */
export function useUpdateCartItemQuantity() {
	const authenticated = useIsAuthenticated();
	const guestUpdateQuantity = useGuestCartStore((s) => s.updateQuantity);

	const authenticatedMutation = useAuthenticatedCartMutation<GuestCartItem>(
		({ productId, quantity }) => updateCartItemQuantity(productId, quantity),
	);

	const guestMutation = useMutation({
		mutationFn: ({ productId, quantity }: GuestCartItem) =>
			guestUpdateQuantity(productId, quantity),
	});

	return authenticated ? authenticatedMutation : guestMutation;
}

/**
 * Clear the authenticated cart completely.
 */
export function useClearCart() {
	const queryClient = useQueryClient();
	const authenticated = useIsAuthenticated();
	const guestClear = useGuestCartStore((s) => s.clear);

	const authenticatedMutation = useMutation({
		mutationFn: clearCart,
		onSuccess: () => {
			queryClient.removeQueries({
				queryKey: cartKeys.all,
			});

			queryClient.invalidateQueries({
				queryKey: cartKeys.all,
			});
		},
	});

	const guestMutation = useMutation({
		mutationFn: guestClear,
	});

	return authenticated ? authenticatedMutation : guestMutation;
}
