import "@tanstack/react-query";
import type { SystemError } from "./shared/types";

declare module "@tanstack/react-query" {
	interface Register {
		defaultError: SystemError; // override the default error type produced by react-query
	}
}

declare global {
	interface Window {
		__TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
	}
}
