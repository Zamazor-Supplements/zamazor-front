import "@tanstack/react-query"
import type { SystemError } from "./shared/types";

declare module "@tanstack/react-query" {
	interface Register {
		defaultError: SystemError; // override the default error type produced by react-query
	}
}
