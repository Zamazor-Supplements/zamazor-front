import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, register } from "./api";
import { tokenManager } from "../globals/tokenManager";
import { authKeys } from "./keys";
import { useAuthStore } from "../stores/authStore";
import router from "@/app/routes/router";
import { APP_ROUTES } from "@/app/routes/paths";
import { queryClient } from "@/app/config/queryClient";
import { useLocation, useNavigate } from "react-router";

export const useRegister = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: register,
		onSuccess: () => {
			navigate(APP_ROUTES.AUTH.LOGIN);
		},
	});
};

export function useLogin() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

	const fallbackRoute = location.state?.from || APP_ROUTES.HOME;

	return useMutation({
		mutationFn: login,
		onSuccess: ({ user, accessToken }) => {
			tokenManager.setAccessToken(accessToken);
			queryClient.setQueryData(authKeys.me(), user);
			setAuthenticated();

			const redirectPath =
				user.role === "ADMIN" ? APP_ROUTES.DASHBOARD.ROOT : fallbackRoute;

			navigate(redirectPath, { replace: true });
		},
	});
}

export function useLogout() {
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			clearAuth();
			queryClient.clear();
			router.navigate(APP_ROUTES.AUTH.LOGIN);
		},
	});
}

export function clearAuth() {
	tokenManager.clear();
	queryClient.removeQueries({
		queryKey: authKeys.me(),
	});
	useAuthStore.getState().setUnauthenticated();
}
