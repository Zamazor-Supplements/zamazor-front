import { create } from "zustand";
// import { type User } from "../schemas/userSchema";
import { AuthStatus } from "../types/auth";
import { devtools } from "zustand/middleware";
// import { tokenManager } from "../globals/tokenManager";
// import { wishlistKeys } from "@/features/wishlists/services/keys";
// import { useGuestCartStore } from "@/features/cart/stores/guestCartStore";
// import { queryClient } from "@/app/config/queryClient";
// import { useGuestWishlistStore } from "@/features/wishlists/stores/guestWishlistStore";
// import { cartKeys } from "@/features/cart/services/keys";
// import { syncCart } from "@/features/cart/services/api";
// import { fetchCurrentUser } from "../services/api";
// import { syncWishlist } from "@/features/wishlists/services/api";

// type AuthState =
// 	| {
// 			readonly user: null;
// 			readonly status: Exclude<AuthStatus, typeof AuthStatus.Authenticated>;
// 	  }
// 	| {
// 			readonly user: Readonly<User>;
// 			readonly status: typeof AuthStatus.Authenticated;
// 	  };

// export const useAuthStore = create<AuthState>(() => ({
// 	user: null,
// 	status: AuthStatus.Loading,
// }));

// export function useAuthenticatedUser() {
// 	const auth = useAuthStore();
// 	if (auth.status !== AuthStatus.Authenticated) {
// 		throw new Error("Must be authenticated");
// 	}
// 	return auth.user;
// }

// export const clearAuth = () => {
// 	useAuthStore.setState({ user: null, status: AuthStatus.Unauthenticated });
// 	tokenManager.clear();
// };

// export const initAuth = async () => {
// 	try {
// 		const user = await fetchCurrentUser();

// 		useAuthStore.setState({ status: AuthStatus.Authenticated, user });
// 	} catch {
// 		clearAuth();
// 	}
// };

// export function useIsAuthenticated() {
// 	return useAuthStore((state) => state.status === AuthStatus.Authenticated);
// }

// useAuthStore.subscribe(async (state, prevState) => {
// 	const prev = prevState.status;
// 	const current = state.status;

// 	if (prev === current) return;

// 	// CASE 1: LOGOUT
// 	if (
// 		prev === AuthStatus.Authenticated &&
// 		current === AuthStatus.Unauthenticated
// 	) {
// 		useGuestCartStore.getState().clear();
// 		useGuestWishlistStore.getState().clear();

// 		queryClient.removeQueries({ queryKey: cartKeys.all });
// 		queryClient.removeQueries({ queryKey: wishlistKeys.all });
// 		return;
// 	}

// 	// CASE 2: LOGIN
// 	if (current === AuthStatus.Authenticated) {
// 		if (prev === AuthStatus.Unauthenticated) {
// 			const cart = useGuestCartStore.getState().items;
// 			const wishlist = useGuestWishlistStore.getState().items;
// 			await Promise.all([
// 				syncCart(cart),
// 				syncWishlist(wishlist),
// 			]);
// 		}

// 		await Promise.all([
// 			queryClient.invalidateQueries({ queryKey: cartKeys.all }),
// 			queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
// 		]);
// 	}
// });
type AuthState = {
	status:
		| typeof AuthStatus.Loading
		| typeof AuthStatus.Authenticated
		| typeof AuthStatus.Unauthenticated;

	setAuthenticated: () => void;
	setUnauthenticated: () => void;
	setLoading: () => void;
};

export const useAuthStore = create<AuthState>()(
	devtools((set) => ({
		status: AuthStatus.Loading,

		setAuthenticated: () =>
			set(
				{ status: AuthStatus.Authenticated },
				undefined,
				"auth/setAuthenticated",
			),
		setUnauthenticated: () =>
			set(
				{ status: AuthStatus.Unauthenticated },
				undefined,
				"auth/setUnauthenticated",
			),
		setLoading: () =>
			set({ status: AuthStatus.Loading }, undefined, "auth/setLoading"),
	})),
);
