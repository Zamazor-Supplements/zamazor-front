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

export function useAuthenticatedUser() {
	const queryClient = useQueryClient();
	return queryClient.getQueryData<User>(authKeys.me())!;
}

export function useIsAuthenticated() {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData<User>(authKeys.me());
	return !!user;
}
