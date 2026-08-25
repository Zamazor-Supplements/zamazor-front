import { useGuestCartStore } from "@/features/cart/stores/guestCartStore";
import { AuthStatus } from "../types/auth";
import { useAuthStore } from "./authStore";
import { useGuestWishlistStore } from "@/features/wishlists/stores/guestWishlistStore";
import { queryClient } from "@/app/config/queryClient";
import { cartKeys } from "@/features/cart/services/keys";
import { wishlistKeys } from "@/features/wishlists/services/keys";
import { syncCart } from "@/features/cart/services/api";
import { syncWishlist } from "@/features/wishlists/services/api";

useAuthStore.subscribe(async (state, prevState) => {
	const prev = prevState.status;
	const current = state.status;

	if (prev === current) return;

	// CASE 1: LOGOUT
	if (
		prev === AuthStatus.Authenticated &&
		current === AuthStatus.Unauthenticated
	) {
		useGuestCartStore.getState().clear();
		useGuestWishlistStore.getState().clear();

		queryClient.removeQueries({ queryKey: cartKeys.all });
		queryClient.removeQueries({ queryKey: wishlistKeys.all });
		return;
	}

	// CASE 2: LOGIN
	if (current === AuthStatus.Authenticated) {
		if (prev === AuthStatus.Unauthenticated) {
			const cart = useGuestCartStore.getState().items;
			const wishlist = useGuestWishlistStore.getState().items;

			const syncPromises = [];
			if (cart.length > 0) syncPromises.push(syncCart(cart));
			if (wishlist.length > 0) syncPromises.push(syncWishlist(wishlist));

			if (syncPromises.length > 0) {
				try {
					await Promise.all(syncPromises);
				} catch {
					// Sync is best-effort: a failed request must not break the
					// login transition or prevent the cache refresh below.
				}
			}
		}

		await Promise.all([
			queryClient.invalidateQueries({ queryKey: cartKeys.all }),
			queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
		]);
	}
});
