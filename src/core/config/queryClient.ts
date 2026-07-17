import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// 1. Deduplicate rapid parallel mounts (Default staleTime)
			// Keeps data "fresh" for 5 seconds so duplicate components mounting
			// at the exact same time share a single network request.
			staleTime: 1000 * 5,

			// 2. Keep unused cache in memory for 10 minutes (Garbage Collection)
			gcTime: 1000 * 60 * 10,

			// 3. Disable aggressive refetching on window focus
			// Prevents hitting your backend API every time a user switches browser tabs.
			refetchOnWindowFocus: false,

			// 4. Retry strategy
			// Only retry once on network failures. Never retry on client errors (4xx).
			retry: (failureCount, error) => {
				if (failureCount >= 1) return false;

				// Do not retry unauthorized or validation errors
				const status = error.status;
				if (status === 401 || status === 403 || status === 422) {
					return false;
				}
				return true;
			},
		},
		mutations: {
			// Retry failed mutations 0 times by default
			retry: false,
		},
	},
});
