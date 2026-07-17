import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../services/addressService";
import type { AddressRequest } from "../schemas/addressSchema";

export const addressKeys = {
	all: ["addresses"] as const,
	default: () => [...addressKeys.all, "default"] as const,
};

// 1. Fetch default address
export function useDefaultAddress() {
	return useQuery({
		queryKey: addressKeys.default(),
		queryFn: addressService.getDefaultAddress,
	});
}

// 2. Create or Update Address
export function useCreateOrUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddressRequest) =>
			addressService.createOrUpdateDefaultAddress(payload),
		onSuccess: (updatedAddress) => {
			// Directly populate/update the cache
			queryClient.setQueryData(addressKeys.default(), updatedAddress);
		},
	});
}

// 3. Update Address
export function useUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AddressRequest) =>
			addressService.updateDefaultAddress(payload),
		onSuccess: (updatedAddress) => {
			queryClient.setQueryData(addressKeys.default(), updatedAddress);
		},
	});
}
