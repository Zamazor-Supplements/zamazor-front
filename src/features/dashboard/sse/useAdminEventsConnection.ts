import { useEffect, useState } from "react";

import {
	adminEventsStream,
	type AdminEventsStatus,
} from "./adminEventsStream";

/**
 * Reactive connection status of the shared admin SSE stream. Useful for a
 * "live" indicator in the dashboard chrome; returns one of
 * "connecting" | "open" | "closed".
 */
export function useAdminEventsConnection(): AdminEventsStatus {
	const [status, setStatus] = useState<AdminEventsStatus>(() =>
		adminEventsStream.getStatus(),
	);

	useEffect(() => adminEventsStream.subscribe(setStatus), []);

	return status;
}
