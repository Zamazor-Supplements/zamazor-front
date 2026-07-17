import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
} from "@tanstack/react-query";
import { userService } from "../services/usersService";
import { AuthStatus } from "../types";
import { tokenManager } from "../globals/tokenManager";
import { useGuestCartStore } from "@/services/cart/GuestCartStore";
// import { useWishlistStore } from "@/features/wishlists/stores/wishlistStore";
import { wishlistService } from "@/features/products/services/wishlistService";
import { cartService } from "@/services/cart/api";
import { useGuestWishlistStore } from "@/features/wishlists/stores/guestWishlistStore";

// 1. Query Key Factory for structured caching
export const userKeys = {
	all: ["users"] as const,
	current: () => [...userKeys.all, "current"] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
};

// ==========================================
// QUERIES
// ==========================================

/**
 * Hook to fetch the currently authenticated user.
 */
export function useCurrentUser() {
	return useQuery({
		queryKey: userKeys.current(),
		queryFn: userService.fetchCurrentUser,
		retry: false,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 60,
	});
}

export function useAuth() {
	const query = useCurrentUser();
	return {
		user: query.data,
		status: query.isPending
			? AuthStatus.Loading
			: query.data
				? AuthStatus.Authenticated
				: AuthStatus.Unauthenticated,
		// ...query,
	};
}

export function useAuthenticatedUser() {
	const { data: user } = useCurrentUser();

	if (!user) {
		throw new Error("Must be authenticated");
	}

	return user;
}

export function useIsAuthenticated() {
	const { data: user } = useCurrentUser();
	return !!user;
}

/**
 * Hook to fetch a specific user by their ID.
 */
export function useUser(id: string) {
	return useQuery({
		queryKey: userKeys.detail(id),
		queryFn: () => userService.getUserById(id),
	});
}

// ==========================================
// MUTATIONS
// ==========================================

/**
 * Hook to update the current user's profile information.
 */
export function useUpdateCurrentUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: {
			fullName: string;
			shippingAddress: string | null;
		}) => userService.updateCurrentUser(payload),
		onSuccess: (updatedUser) => {
			// Direct cache updates: immediately update "current" and the ID-specific cache
			queryClient.setQueryData(userKeys.current(), updatedUser);

			if (updatedUser?.id) {
				queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
			}

			// Optional: Invalidate user queries to make sure everything is in sync
			queryClient.invalidateQueries({ queryKey: userKeys.all });
		},
	});
}

/**
 * Triggers the side effects needed when transitioning to an AUTHENTICATED state.
 * Synchronizes the guest cart and wishlist with the database, then refreshes the wishlist.
 */
async function handleLoginSuccess() {
	const cart = useGuestCartStore.getState().items;
	const wishlist = useGuestWishlistStore.getState().items;

	// Sync state to backend database
	if (cart.length > 0) {
		await cartService.syncCart(cart);
	}
	if (wishlist.length > 0) {
		await wishlistService.syncWishlist(wishlist);
	}
}

/**
 * Imperative function to boot up and initialize authentication.
 * Typically called once at application mount.
 */
export const initAuth = async (queryClient: QueryClient) => {
	try {
		// Fetch and cache the user inside TanStack Query
		const user = await queryClient.fetchQuery({
			queryKey: userKeys.current(),
			queryFn: userService.fetchCurrentUser,
		});

		if (user) {
			await handleLoginSuccess();
		}
	} catch {
		clearAuth(queryClient);
	}
};

/**
 * Completely logs out the user, wipes the cache, and flushes storage.
 */
export const clearAuth = (queryClient: QueryClient) => {
	queryClient.setQueryData(userKeys.current(), null);

	tokenManager.clear();

	useGuestCartStore.getState().clear();
	useGuestWishlistStore.getState().clear();

	queryClient.invalidateQueries();
};
