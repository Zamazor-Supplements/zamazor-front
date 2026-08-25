import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	useGuestCartStore,
	type GuestStoreCartItem,
} from "../stores/guestCartStore";
import { useCartDrawerStore } from "../stores/cartDrawerStore";
import { cartKeys } from "./keys";
import type { Cart, CartItem } from "../schemas/cartSchema";
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
	const openCartDrawer = useCartDrawerStore((s) => s.open);

	return useMutation({
		mutationFn: async ({ product, quantity }: CartItem) =>
			guestAddItem(product.id, quantity),
		onSuccess: () => {
			openCartDrawer();
		},
	});
}

function useAuthenticatedAddToCart() {
	const queryClient = useQueryClient();
	const openCartDrawer = useCartDrawerStore((s) => s.open);

	return useMutation({
		mutationFn: async ({ product, quantity }: CartItem) =>
			addToCart(product.id, quantity),
		onSuccess: (data) => {
			queryClient.setQueryData(cartKeys.all, data);
			openCartDrawer();
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

export interface ReorderLine {
	productId: string;
	quantity: number;
}

/**
 * Re-add a previous order's line items to the cart (guest or authenticated).
 * Each line is added through the standard add-to-cart path, then the cart
 * drawer opens so the restored items are immediately visible.
 */
export function useReorder() {
	const authenticated = useIsAuthenticated();
	const queryClient = useQueryClient();
	const guestAddItem = useGuestCartStore((s) => s.addItem);
	const openCartDrawer = useCartDrawerStore((s) => s.open);

	return useMutation({
		mutationFn: async (lines: ReorderLine[]) => {
			await Promise.all(
				lines.map((line) =>
					authenticated
						? addToCart(line.productId, line.quantity)
						: guestAddItem(line.productId, line.quantity),
				),
			);
		},
		onSuccess: () => {
			if (authenticated) {
				queryClient.invalidateQueries({
					queryKey: cartKeys.all,
				});
			}
			openCartDrawer();
		},
	});
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

	const authenticatedMutation =
		useAuthenticatedCartMutation<GuestStoreCartItem>(
			({ productId, quantity }) => updateCartItemQuantity(productId, quantity),
		);

	const guestMutation = useMutation({
		mutationFn: ({ productId, quantity }: GuestStoreCartItem) =>
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
