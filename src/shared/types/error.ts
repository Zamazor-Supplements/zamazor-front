import { AxiosError, isAxiosError, isCancel } from "axios";
import { z } from "zod/v4";

const systemErrorSchema = z.object({
	code: z.string().default("SYSTEM_ERROR"),
	type: z.string().default("about:blank"),
	status: z.number(),
	title: z.string(),
	detail: z.unknown(),
	instance: z.string().optional(),
	description: z.string().default(""),
});
export type SystemError = z.infer<typeof systemErrorSchema>;

export function isSystemError(value: unknown): value is SystemError {
	return systemErrorSchema.safeParse(value).success;
}

const CANCELED_ERROR = {
	type: "about:blank",
	title: "Request Canceled",
	description: "Request was canceled",
	status: 499,
	detail: "The network request was intentionally aborted.",
	code: "REQUEST_CANCELED",
} satisfies SystemError;

const NETWORK_ERROR = {
	type: "about:blank",
	title: "Network Error",
	description: "Server could not be reached",
	status: 0,
	detail:
		"The server is offline or the request was blocked by CORS constraints.",
	code: "NETWORK_FAILURE",
} satisfies SystemError;

const TIMEOUT_ERROR = {
	type: "about:blank",
	title: "Request Timeout",
	status: 504,
	description: "Server took too long to respond",
	detail: "The request was exceeded the allowed response time limit.",
	code: "REQUEST_TIMEOUT",
} satisfies SystemError;

const getErrorDetail = (error: unknown): unknown => {
	if (isAxiosError(error)) {
		const responseData = error.response?.data;

		if (responseData) {
			if (typeof responseData === "string") {
				return responseData;
			}
			if (typeof responseData === "object" && responseData !== null)
				return responseData;
		}
		return error.message || "The request failed unexpectedly.";
	}
	return error;
};

const createRuntimeError = (error: unknown) =>
	({
		type: "about:blank",
		title: "Runtime Error",
		description: "An unexpected error occurred.",
		status: 500,
		detail: getErrorDetail(error),
		code: "RUNTIME_ERROR",
	}) satisfies SystemError;

const createUnexpectedError = (error: AxiosError) =>
	({
		type: "about:blank",
		title: error.response?.statusText?.trim() || "Server Error",
		status: error.response?.status ?? 500,
		description: "Unexpected server response.",
		detail: getErrorDetail(error),
		code: "SYSTEM_ERROR",
	}) satisfies SystemError;

export function normalizeError(error: unknown): SystemError {
	if (isSystemError(error)) return error;
	if (isCancel(error)) return CANCELED_ERROR;
	if (!isAxiosError(error)) return createRuntimeError(error);
	if (error.code === "ECONNABORTED") return TIMEOUT_ERROR;

	if (error.response) {
		const parsed = systemErrorSchema.safeParse(error.response.data);
		if (parsed.success) return parsed.data;

		return createUnexpectedError(error);
	}
	return NETWORK_ERROR;
}
