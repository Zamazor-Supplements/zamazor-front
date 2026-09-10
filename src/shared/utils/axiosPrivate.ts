import axios, {
	AxiosError,
	AxiosHeaders,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import CONFIG from "@/app/config/constants";
import { notify } from "@/lib/notify";
import { tokenManager } from "@/features/auth/globals/tokenManager";
import { refresh } from "@/features/auth/services/api";
import { clearAuth } from "@/features/auth/services/mutations";
import { coreApiRequest, type ApiRequestOptions } from "./coreApiRequest";

const AUTHORIZATION_HEADER = "Authorization";
const SESSION_EXPIRED_TITLE = "Session Expired";
const SESSION_EXPIRED_DESCRIPTION =
	"Your session has expired. Please log in again to continue.";

const axiosPrivate = axios.create({
	baseURL: CONFIG.API_BASE_URL,
	timeout: CONFIG.TIMEOUT,
	headers: {
		"Content-Type": "application/json",
		skip_zrok_interstitial: "true",
	},
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

/**
 * Single-flight refresh:
 * all requests awaiting a fresh token share the same promise.
 */
let refreshPromise: Promise<string> | null = null;

function ensureHeaders(config: InternalAxiosRequestConfig): AxiosHeaders {
	const headers = AxiosHeaders.from(config.headers);
	config.headers = headers;
	return headers;
}

function hasAuthorizationHeader(config: InternalAxiosRequestConfig): boolean {
	return Boolean(AxiosHeaders.from(config.headers).get(AUTHORIZATION_HEADER));
}

function setAuthorizationHeader(
	config: InternalAxiosRequestConfig,
	token: string,
): void {
	ensureHeaders(config).set(AUTHORIZATION_HEADER, `Bearer ${token}`);
}

async function startTokenRefresh(): Promise<string> {
	const newToken = await refresh();

	if (!newToken) {
		throw new Error("Session refresh failed: no access token returned.");
	}

	return newToken;
}

function getFreshAccessToken(): Promise<string> {
	refreshPromise ??= startTokenRefresh().finally(() => {
		refreshPromise = null;
	});

	return refreshPromise;
}

async function getAccessTokenForRequest(): Promise<string> {
	const existingToken = tokenManager.getAccessToken();
	return existingToken ?? getFreshAccessToken();
}

function handleAuthenticationFailure(error: unknown): never {
	/**
	 * Avoid unnecessary noise when no authenticated session exists anymore.
	 */
	if (tokenManager.getAccessToken()) {
		notify.error(SESSION_EXPIRED_TITLE, {
			description: SESSION_EXPIRED_DESCRIPTION,
		});
	}

	clearAuth();

	throw error instanceof Error ? error : new Error("Authentication failed.");
}

function shouldRetryWithRefresh(
	error: AxiosError,
	request?: RetryableRequestConfig,
): request is RetryableRequestConfig {
	return error.response?.status === 401 && !!request && !request._retry;
}

axiosPrivate.interceptors.request.use(
	async (config) => {
		if (hasAuthorizationHeader(config)) {
			return config;
		}

		const token = await getAccessTokenForRequest();
		setAuthorizationHeader(config, token);

		return config;
	},
	(error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const request = error.config as RetryableRequestConfig | undefined;

		if (!shouldRetryWithRefresh(error, request)) {
			throw error;
		}

		request._retry = true;

		try {
			const newToken = await getFreshAccessToken();
			setAuthorizationHeader(request, newToken);

			return await axiosPrivate.request(request);
		} catch (refreshError) {
			handleAuthenticationFailure(refreshError);
		}
	},
);

export async function privateApiRequest<T>(
	config: AxiosRequestConfig,
	options: Omit<ApiRequestOptions, "axiosInstance"> = {},
) {
	return coreApiRequest<T>(config, {
		axiosInstance: axiosPrivate,
		...options,
	});
}
