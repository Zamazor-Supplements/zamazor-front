import { useEffect, type PropsWithChildren } from "react";

import { useAuthStore } from "@/features/auth/stores/authStore";
import { AuthStatus } from "@/features/auth/types/auth";
import { adminEventsStream } from "./adminEventsStream";

/**
 * Owns the lifetime of the shared admin SSE connection.
 *
 * Rendered inside {@link DashboardLayout}, which React Router only mounts under
 * `<RequireAuth allowedRoles={["ADMIN"]}>`, so this provider exists exactly for
 * the authenticated admin area. It acquires one lease on the module-level
 * stream (single shared EventSource — StrictMode double-mounts and several
 * dashboard pages can never create duplicates) and releases it on unmount or
 * when the session flips to unauthenticated (logout / session expiry), which
 * closes the connection and cancels any pending reconnect.
 */
export function AdminEventsProvider({ children }: PropsWithChildren) {
	const isAuthenticated = useAuthStore(
		(state) => state.status === AuthStatus.Authenticated,
	);

	useEffect(() => {
		if (!isAuthenticated) return;

		adminEventsStream.start();

		return () => adminEventsStream.stop();
	}, [isAuthenticated]);

	return children;
}
