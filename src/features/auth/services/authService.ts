import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import { publicApiRequest } from "@/shared/utils/axiosPublic";
import { clearAuth, useAuthStore } from "../stores/authStore";
import {
	refreshResponseSchema,
	type RefreshResponse,
} from "../schemas/authSchema";
import { tokenManager } from "../globals/tokenManager";
import { AuthStatus } from "../types";
import {
	loginResponseSchema,
	type LoginRequest,
	type LoginResponse,
} from "../schemas/loginSchema";
import type { User } from "../schemas/userSchema";
import type { RegisterRequest } from "../schemas/registerSchema";
import { useGuestCartStore } from "@/services/cart/GuestCartStore";
import { useGuestWishlistStore } from "@/features/wishlists/stores/guestWishlistStore";

export const authService = {
	register: async (data: RegisterRequest) => {
		return publicApiRequest<User>(
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
	},

	login: async (data: LoginRequest) => {
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
				ignoreErrors: true,
			},
		);

		const parsed = loginResponseSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Login response data validation failed:", {
				cause: parsed.error,
			});
		}

		const { user, accessToken } = parsed.data;

		useAuthStore.setState({
			user,
			status: AuthStatus.Authenticated,
		});
		tokenManager.setAccessToken(accessToken);

		return response;
	},

	logout: async () => {
		await publicApiRequest<void>({
			url: API_ENDPOINTS.AUTH.LOGOUT,
			method: "POST",
		});

		clearAuth();

		useGuestCartStore.getState().clear();
		useGuestWishlistStore.getState().clear();
	},

	refresh: async () => {
		try {
			const response = await publicApiRequest<RefreshResponse>(
				{
					url: API_ENDPOINTS.AUTH.REFRESH,
					method: "POST",
					withCredentials: true,
				},
				{ ignoreErrors: true },
			);

			const parsed = refreshResponseSchema.safeParse(response);
			if (!parsed.success) {
				clearAuth();
				throw new Error("Token refresh data validation failed:", {
					cause: parsed.error,
				});
			}
			const { accessToken } = parsed.data;
			tokenManager.setAccessToken(accessToken);
			return accessToken;
		} catch (error) {
			clearAuth();
			throw error;
		}
	},
};
