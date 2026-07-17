import { useQuery } from "@tanstack/react-query";
import { useGuestCartStore } from "./GuestCartStore";
import { useIsAuthenticated } from "@/features/auth/stores/authStore";
import { useMemo } from "react";
import { remoteCartService } from "./RemoteCartService";
import { remoteCartSummaryService } from "./RemoteCartSummaryService";
import { guestCartSummaryService } from "./GuestCartSummaryService";
import { cartKeys } from "./queryKeys";

// ==========================================
// QUERIES
// ==========================================

/**
 * Hook to fetch the main authenticated cart.
 */
export function useCart() {
	const isLoggedIn = useIsAuthenticated();

	return useQuery({
		queryKey: cartKeys.details(isLoggedIn),
		queryFn: () => remoteCartService.getItems(),
		enabled: isLoggedIn,
	});
}

export function useCartCount() {
	const isLoggedIn = useIsAuthenticated();
	const { data: cartItems } = useCart();

	const guestCartItems = useGuestCartStore((state) => state.items);
	const isHydrated = useGuestCartStore((state) => state.isHydrated);

	return useMemo(() => {
		const activeItems = isLoggedIn
			? cartItems
			: isHydrated
				? guestCartItems
				: [];

		if (!activeItems) return 0;
		return activeItems.reduce((sum, item) => sum + item.quantity, 0);
	}, [cartItems, guestCartItems, isHydrated, isLoggedIn]);
}

/**
 * Hook to fetch the cart summary (handles both guest and logged-in states).
 * Includes params in the query key so the cache updates when items change.
 */
export function useCartSummary() {
	const isLoggedIn = useIsAuthenticated();
	const guestItems = useGuestCartStore((state) => state.items);
	const isHydrated = useGuestCartStore((state) => state.isHydrated);

	const guestItemsHash = useMemo(() => {
		return isLoggedIn ? "" : JSON.stringify(guestItems);
	}, [guestItems, isLoggedIn]);

	return useQuery({
		queryKey: cartKeys.summary(isLoggedIn, guestItemsHash),
		queryFn: () =>
			isLoggedIn
				? remoteCartSummaryService.getSummary()
				: guestCartSummaryService.getSummary(guestItems),
		enabled: isLoggedIn || isHydrated,
	});
}
