import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import {
	addressSchema,
	type Address,
	type AddressRequest,
} from "../schemas/addressSchema";
import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import { parseResponse } from "@/shared/utils/parseResponse";

export const getDefaultAddress = async () => {
	const response = await privateApiRequest<Address | null>(
		{
			url: API_ENDPOINTS.ADDRESSES.ROOT,
			method: "GET",
		},
		{ ignoreErrors: true },
	);

	return parseResponse(
		response,
		addressSchema,
		"Address data validation failed",
	);
};

export const createOrUpdateDefaultAddress = async (payload: AddressRequest) => {
	const response = await privateApiRequest<Address>({
		url: API_ENDPOINTS.ADDRESSES.ROOT,
		method: "POST",
		data: payload,
	});

	return parseResponse(
		response,
		addressSchema,
		"Address data validation failed",
	);
};

export const updateDefaultAddress = async (payload: AddressRequest) => {
	const response = await privateApiRequest<Address>({
		url: API_ENDPOINTS.ADDRESSES.ROOT,
		method: "PUT",
		data: payload,
	});

	return parseResponse(
		response,
		addressSchema,
		"Address data validation failed",
	);
};
