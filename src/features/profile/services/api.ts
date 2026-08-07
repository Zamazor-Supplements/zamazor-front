import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import { userSchema, type User } from "@/features/auth/schemas/userSchema";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { parseResponse } from "@/shared/utils/parseResponse";

export const getUserById = async (id: string) => {
	const response = await privateApiRequest<User>({
		url: API_ENDPOINTS.USERS.DETAILS(id),
		method: "GET",
	});

	return parseResponse(response, userSchema, "User data validation failed");
};

export const updateCurrentUser = async (payload: { fullName: string }) => {
	const response = await privateApiRequest<User>({
		url: API_ENDPOINTS.USERS.ME,
		method: "PUT",
		data: payload,
	});

	return parseResponse(response, userSchema, "User data validation failed");
};
