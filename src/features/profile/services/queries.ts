import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { getUserById } from "./api";

export function useUser(id: string | undefined) {
	return useQuery({
		queryKey: userKeys.detail(id!),
		queryFn: () => getUserById(id!),
		enabled: !!id,
	});
}
