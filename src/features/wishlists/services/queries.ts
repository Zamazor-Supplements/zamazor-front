import { useIsAuthenticated } from "@/features/auth/services/queries";
import { useGuestWishlistStore } from "../stores/guestWishlistStore";
import { useQuery } from "@tanstack/react-query";
import { wishlistKeys } from "./keys";
import { getWishlist } from "./api";
import { useBulkProducts } from "@/features/products/services/product/queries";

/**
 * Hook specifically for Authenticated users: Fetches full Product objects directly.
 */
function useAuthenticatedWishlist(authenticated: boolean) {
	return useQuery({
		queryKey: wishlistKeys.all,
		queryFn: getWishlist,
		enabled: authenticated,
	});
}

/**
 * Hook specifically for Guest users: Resolves IDs from Zustand store, then fetches products via bulk query.
 */
function useGuestWishlist(authenticated: boolean) {
	const hydrated = useGuestWishlistStore((s) => s.isHydrated);
	const ids = useGuestWishlistStore((s) => s.items);

	const query = useBulkProducts(ids, {
		enabled: !authenticated && hydrated && ids.length > 0,
	});

	if (!hydrated) {
		return {
			...query,
			data: [],
			isPending: true,
		};
	}

	if (ids.length === 0) {
		return {
			...query,
			data: [],
			isPending: false,
		};
	}

	return query;
}

/**
 * Main wishlist hook: Delegates cleanly based on auth status.
 * Authenticated users call getWishlist() directly. Guests use Zustand IDs + bulk fetch.
 */
export function useWishlist() {
	const authenticated = useIsAuthenticated();

	const authQuery = useAuthenticatedWishlist(authenticated);
	const guestQuery = useGuestWishlist(authenticated);

	const activeQuery = authenticated ? authQuery : guestQuery;

	return {
		data: activeQuery.data ?? [],
		isPending: activeQuery.isPending,
		isError: activeQuery.isError,
		refetch: activeQuery.refetch,
	};
}

/**
 * Checks if a specific product ID exists in the wishlist.
 * For guests, it checks Zustand. For auth, it checks the cached full product list.
 */
export function useIsWishlistItem(productId: string) {
	const authenticated = useIsAuthenticated();
	const guestItems = useGuestWishlistStore((s) => s.items);

	const { data: authProducts } = useQuery({
		queryKey: wishlistKeys.all,
		queryFn: getWishlist,
		enabled: authenticated,
	});

	if (authenticated) {
		return authProducts?.some((product) => product.id === productId) ?? false;
	}

	return guestItems.includes(productId);
}

/**
 * Returns the total count of items in the wishlist.
 */
export function useWishlistCount() {
	const { data = [] } = useWishlist();

	return data.length;
}
