import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { LoginRequest } from "../schemas/loginSchema";
import type { RegisterRequest } from "../schemas/registerSchema";

export const useRegisterMutation = () => {
	return useMutation({
		mutationFn: (data: RegisterRequest) => authService.register(data),
	});
};

export const useLoginMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: LoginRequest) => authService.login(data),
		onSuccess: () => {
			// Clear all cached queries upon login to prevent data leaks 
			// from previous sessions or stale users
			queryClient.clear();
		},
	});
};

export const useLogoutMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			// Wipe cache so the next user starts completely fresh
			queryClient.clear();
		},
	});
};