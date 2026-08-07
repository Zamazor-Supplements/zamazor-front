import { userKeys } from "./keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "./api";
import { authKeys } from "@/features/auth/services/keys";

export function useUpdateCurrentUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: { fullName: string }) => updateCurrentUser(payload),
		onSuccess: (updatedUser) => {
			queryClient.setQueryData(authKeys.me(), updatedUser);
			queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
		},
	});
}
