import { publicApiRequest } from "@/shared/utils/axiosPublic";
import {
	refreshResponseSchema,
	type RefreshResponse,
} from "../schemas/authSchema";
import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import {
	loginResponseSchema,
	type LoginRequest,
	type LoginResponse,
} from "../schemas/loginSchema";
import type { RegisterRequest } from "../schemas/registerSchema";
import { userSchema, type User } from "../schemas/userSchema";
import { parseResponse } from "@/shared/utils/parseResponse";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { tokenManager } from "../globals/tokenManager";
import type {
	RequestPasswordResetInput,
	ResetPasswordRequest,
} from "../schemas/resetPasswordSchema";

export const register = async (data: RegisterRequest) => {
	const response = await publicApiRequest<User>(
		{
			url: API_ENDPOINTS.AUTH.REGISTER,
			method: "POST",
			data,
		},
		{
			successMessage: {
				title: "Registration successful. Please login.",
				description: "Your account has been created successfully.",
			},
		},
	);

	return parseResponse(
		response,
		userSchema,
		"Register response data validation failed",
	);
};

export const login = async (data: LoginRequest) => {
	const response = await publicApiRequest<LoginResponse>(
		{
			url: API_ENDPOINTS.AUTH.LOGIN,
			method: "POST",
			data,
		},
		{
			successMessage: {
				title: "Login successful!",
				description: "You’re all set — let’s get started.",
			},
		},
	);

	return parseResponse(
		response,
		loginResponseSchema,
		"Login response data validation failed",
	);
};

export const logout = async () => {
	// Revoke the refresh token on the server first so the session is truly
	// closed even if the tab is closed right after. Best-effort: a failed
	// POST (e.g. offline) must not block the client-side logout.
	try {
		await publicApiRequest<void>({
			url: API_ENDPOINTS.AUTH.LOGOUT,
			method: "POST",
		});
	} catch {
		// Session is cleared client-side regardless.
	}
};

export const refresh = async () => {
	const response = await publicApiRequest<RefreshResponse>(
		{
			url: API_ENDPOINTS.AUTH.REFRESH,
			method: "POST",
			withCredentials: true,
		},
		{ ignoreErrors: true },
	);

	const parsed = parseResponse(
		response,
		refreshResponseSchema,
		"Token refresh data validation failed",
	);

	tokenManager.setAccessToken(parsed.accessToken);
	return parsed.accessToken;
};

export const forgotPassword = async (data: RequestPasswordResetInput) => {
	await publicApiRequest<void>(
		{
			url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
			method: "POST",
			data,
		},
		{ ignoreErrors: true },
	);
};

export const resetPassword = async (data: ResetPasswordRequest) => {
	await publicApiRequest<void>(
		{
			url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
			method: "POST",
			data,
		},
		{ ignoreErrors: true },
	);
};

export const fetchCurrentUser = async () => {
	const response = await privateApiRequest<User>(
		{ url: API_ENDPOINTS.AUTH.ME, method: "GET" },
		{ ignoreErrors: true },
	);
	return parseResponse(response, userSchema, "User data validation failed");
};
