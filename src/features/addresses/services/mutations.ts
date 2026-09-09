import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address, AddressRequest } from "../schemas/addressSchema";
import { createOrUpdateDefaultAddress, updateDefaultAddress } from "./api";
import { addressKeys } from "./keys";
import { authKeys } from "@/features/auth/services/keys";

export function useCreateOrUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddressRequest) =>
			createOrUpdateDefaultAddress(payload),
		onSuccess: (updatedAddress) => {
			queryClient.setQueryData(addressKeys.default(), updatedAddress);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.me() });
		},
	});
}

export function useUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddressRequest) => updateDefaultAddress(payload),
		onMutate: (payload) => {
			const previous = queryClient.getQueryData<Address>(addressKeys.default());
			queryClient.setQueryData<Address>(addressKeys.default(), (current) => {
				if (!current) return undefined;
				return { ...current, ...payload };
			});
			return { previous };
		},
		onSuccess: (updatedAddress) => {
			queryClient.setQueryData(addressKeys.default(), updatedAddress);
		},
		onError: (error, _variables, context) => {
			if (error.status < 400 && error.status !== 0) return; // request processed
			queryClient.setQueryData(addressKeys.default(), context?.previous); // rollback
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: addressKeys.default() });
		},
	});
}
