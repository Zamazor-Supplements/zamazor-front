import { create } from "zustand";
import { type User } from "../schemas/userSchema";
import { AuthStatus } from "../types";
import { tokenManager } from "../globals/tokenManager";
import { cartService } from "@/services/cart/api";
import { userService } from "../services/usersService";
import { wishlistService } from "@/features/products/services/wishlistService";
import { useGuestCartStore } from "@/services/cart/GuestCartStore";
import { queryClient } from "@/core/config/queryClient";
import { wishlistKeys } from "@/features/wishlists/hooks/use-wishlist";
import { useGuestWishlistStore } from "@/features/wishlists/stores/guestWishlistStore";
import { cartKeys } from "@/services/cart/queryKeys";

type AuthState =
	| {
			readonly user: null;
			readonly status: Exclude<AuthStatus, typeof AuthStatus.Authenticated>;
	  }
	| {
			readonly user: Readonly<User>;
			readonly status: typeof AuthStatus.Authenticated;
	  };

export const useAuthStore = create<AuthState>(() => ({
	user: null,
	status: AuthStatus.Loading,
}));

export function useAuthenticatedUser() {
	const auth = useAuthStore();
	if (auth.status !== AuthStatus.Authenticated) {
		throw new Error("Must be authenticated");
	}
	return auth.user;
}

export const clearAuth = () => {
	useAuthStore.setState({ user: null, status: AuthStatus.Unauthenticated });
	tokenManager.clear();
};

export const initAuth = async () => {
	try {
		const user = await userService.fetchCurrentUser();

		useAuthStore.setState({ status: AuthStatus.Authenticated, user });
	} catch {
		clearAuth();
	}
};

export function useIsAuthenticated() {
	return useAuthStore((state) => state.status === AuthStatus.Authenticated);
}

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
			await Promise.all([
				cartService.syncCart(cart),
				wishlistService.syncWishlist(wishlist),
			]);
		}

		await Promise.all([
			queryClient.invalidateQueries({ queryKey: cartKeys.all }),
			queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
		]);
	}
});
