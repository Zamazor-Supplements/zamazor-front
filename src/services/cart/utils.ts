import { useAuthStore } from "@/features/auth/stores/authStore";
import { AuthStatus } from "@/features/auth/types";
import { cartKeys } from "./queryKeys";
import type { QueryClient } from "@tanstack/react-query";
import type { GuestCartItem } from "./GuestCartStore";

export const handleCartSuccess = (
	queryClient: QueryClient,
	isLoggedIn: boolean,
	updatedItems: GuestCartItem[] | void,
) => {
	if (isLoggedIn) {
		if (updatedItems) {
			queryClient.setQueryData(cartKeys.details(isLoggedIn), updatedItems);
		} else {
			queryClient.invalidateQueries({ queryKey: cartKeys.details(isLoggedIn) });
		}
		queryClient.invalidateQueries({ queryKey: cartKeys.summaries() });
	}
};

export const checkIsLoggedIn = (): boolean => {
	return useAuthStore.getState().status === AuthStatus.Authenticated;
};
