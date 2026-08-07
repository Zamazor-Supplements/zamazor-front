import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 30,
			refetchOnWindowFocus: false,
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
			retry: false,
		},
	},
});

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
