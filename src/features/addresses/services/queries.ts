import { useQuery } from "@tanstack/react-query";
import { addressKeys } from "./keys";
import { getDefaultAddress } from "./api";

export function useDefaultAddress() {
	return useQuery({
		queryKey: addressKeys.default(),
		queryFn: getDefaultAddress,
	});
}
