import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import {
	addressSchema,
	type Address,
	type AddressRequest,
} from "../schemas/addressSchema";

export const addressService = {
	getDefaultAddress: async () => {
		const response = await privateApiRequest<Address | null>(
			{
				url: API_ENDPOINTS.ADDRESSES.ROOT,
				method: "GET",
			},
			{ ignoreErrors: true },
		);

		const parsed = addressSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Address data validation failed: ", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	createOrUpdateDefaultAddress: async (payload: AddressRequest) => {
		const response = await privateApiRequest<Address>({
			url: API_ENDPOINTS.ADDRESSES.ROOT,
			method: "POST",
			data: payload,
		});

		const parsed = addressSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Address data validation failed: ", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	updateDefaultAddress: async (payload: AddressRequest) => {
		const response = await privateApiRequest<Address>({
			url: API_ENDPOINTS.ADDRESSES.ROOT,
			method: "PUT",
			data: payload,
		});

		const parsed = addressSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Address data validation failed: ", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},
};
