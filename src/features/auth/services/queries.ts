import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser } from "./api";
import { authKeys } from "./keys";
import { useAuthStore } from "../stores/authStore";
import { AuthStatus } from "../types/auth";
import type { User } from "../schemas/userSchema";

export function useCurrentUser() {
	const unauthorized = useAuthStore(
		(state) => state.status === AuthStatus.Unauthenticated,
	);

	return useQuery({
		queryKey: authKeys.me(),
		queryFn: fetchCurrentUser,
		enabled: !unauthorized,
	});
}

export function useAuthenticatedUser(): User {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData<User>(authKeys.me());
	if (!user) {
		// Should never happen in practice (RequireAuth guards authenticated
		// routes), but if the cache is cleared mid-render we bail gracefully
		// instead of crashing with a TypeError on property access.
		return {
			id: "",
			fullName: "",
			email: "",
			address: null,
			role: "USER"
		} as User;
	}
	return user;
}

export function useIsAuthenticated() {
	const { data: user } = useCurrentUser();
	return !!user;
}
