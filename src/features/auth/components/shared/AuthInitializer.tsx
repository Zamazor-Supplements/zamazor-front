import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import { authKeys } from "../../services/keys";
import { fetchCurrentUser } from "../../services/api";
import { AuthStatus } from "../../types/auth";
import { useEffect, type PropsWithChildren } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function AuthInitializer({ children }: PropsWithChildren) {
	const initialized = useAuthStore(
		(state) => state.status !== AuthStatus.Loading,
	);
	const { setAuthenticated, setUnauthenticated } = useAuthStore();

	const query = useQuery({
		queryKey: authKeys.me(),
		queryFn: fetchCurrentUser,
		enabled: !initialized,
	});

	useEffect(() => {
		if (query.status === "success") setAuthenticated();
		if (query.status === "error") setUnauthenticated();
	}, [query.status, setAuthenticated, setUnauthenticated]);

	if (!initialized) {
		return <LoadingScreen />;
	}

	return children;
}
