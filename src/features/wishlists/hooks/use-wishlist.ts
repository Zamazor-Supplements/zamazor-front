// ==========================================
// QUERY KEY FACTORY

import { wishlistService } from "@/features/products/services/wishlistService";
import { useGuestWishlistStore } from "../stores/guestWishlistStore";
import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import {
	useAuthStore,
	useIsAuthenticated,
} from "@/features/auth/stores/authStore";
import { AuthStatus } from "@/features/auth/types";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/schemas/productSchema";

// ==========================================
export const wishlistKeys = {
	all: ["wishlist"] as const,
	items: (isLoggedIn: boolean, guestItemsHash?: string) =>
		[
			...wishlistKeys.all,
			"items",
			isLoggedIn ? "authenticated" : "guest",
			...(isLoggedIn ? [] : guestItemsHash ? [guestItemsHash] : []),
		] as const,
};

// Helper helper to handle caching and invalidation side effects cleanly
const handleWishlistSuccess = (
	queryClient: QueryClient,
	isLoggedIn: boolean,
	updatedProducts?: Product[],
) => {
	if (isLoggedIn) {
		if (updatedProducts) {
			queryClient.setQueryData(wishlistKeys.items(true), updatedProducts);
		} else {
			queryClient.invalidateQueries({ queryKey: wishlistKeys.items(true) });
		}
	}
};

const checkIsLoggedIn = (): boolean => {
	return useAuthStore.getState().status === AuthStatus.Authenticated;
};

// ==========================================
// QUERIES
// ==========================================

/**
 * Fetches the authenticated remote user's full wishlist items.
 */
export function useWishlist() {
	const isLoggedIn = useIsAuthenticated();
	const guestItems = useGuestWishlistStore((state) => state.items);
	const isHydrated = useGuestWishlistStore((state) => state.isHydrated);

	const guestItemsHash = useMemo(() => {
		return isLoggedIn ? "" : JSON.stringify(guestItems);
	}, [guestItems, isLoggedIn]);

	return useQuery({
		queryKey: wishlistKeys.items(isLoggedIn, guestItemsHash),
		queryFn: async () => {
			if (isLoggedIn) return wishlistService.getWishlist();
			if (guestItems.length === 0) return [];

			return productService.bulkProducts(guestItems);
		},
		enabled: isLoggedIn || isHydrated,
	});
}

/**
 * Universal hook to check if an item is wishlisted, handling both Guest and Auth scopes seamlessly.
 */
export function useIsWishlistItem(productId: string): boolean {
	const isLoggedIn = useIsAuthenticated();
	const { data: remoteItems } = useWishlist();

	const guestWishlist = useGuestWishlistStore((state) => state.items);
	const isHydrated = useGuestWishlistStore((state) => state.isHydrated);

	return useMemo(() => {
		if (isLoggedIn) {
			// Remote arrays typically contain structural item payloads containing product objects
			return remoteItems?.some((product) => product.id === productId) ?? false;
		}
		return isHydrated ? guestWishlist.includes(productId) : false;
	}, [isLoggedIn, remoteItems, guestWishlist, isHydrated, productId]);
}

// ==========================================
// MUTATIONS
// ==========================================

/**
 * Sync local guest variables with the database environment upon authentication.
 */
export function useSyncWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => wishlistService.syncWishlist(ids),
		onSuccess: (updatedProducts) =>
			handleWishlistSuccess(queryClient, true, updatedProducts),
	});
}

/**
 * Toggles an item state inside the active wishlist tracking configuration.
 */
export function useToggleWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (productId: string) => {
			const isLoggedIn = checkIsLoggedIn();
			if (isLoggedIn) {
				return wishlistService.toggleToWishlist(productId);
			} else {
				return useGuestWishlistStore.getState().toggleItem(productId);
			}
		},
		onSuccess: (data) => {
			const isLoggedIn = checkIsLoggedIn();
			const updatedProducts = isLoggedIn ? (data as Product[]) : undefined;
			handleWishlistSuccess(queryClient, isLoggedIn, updatedProducts);
		},
	});
}

/**
 * Destroys all stored contents inside the active wishlist vector.
 */
export function useClearWishlist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const isLoggedIn = checkIsLoggedIn();
			if (isLoggedIn) {
				await wishlistService.clearWishlist();
			} else {
				useGuestWishlistStore.getState().clear();
			}
		},
		onSuccess: () => {
			const isLoggedIn = checkIsLoggedIn();
			handleWishlistSuccess(queryClient, isLoggedIn);

			if (isLoggedIn) {
				queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
			} else {
				queryClient.setQueryData(wishlistKeys.items(false, "[]"), []);
			}
		},
	});
}
