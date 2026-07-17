import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { userSchema, type User } from "../schemas/userSchema";
import { API_ENDPOINTS } from "@/core/config/apiEndpoints";

export const userService = {
	fetchCurrentUser: async () => {
		const response = await privateApiRequest<User>(
			{ url: API_ENDPOINTS.AUTH.ME, method: "GET" },
			{ ignoreErrors: true },
		);

		const parsed = userSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Current user data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	getUserById: async (id: string) => {
		const response = await privateApiRequest<User>({
			url: API_ENDPOINTS.USERS.DETAILS(id),
			method: "GET",
		});

		const parsed = userSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("User data validation failed: ", { cause: parsed.error });
		}
		return parsed.data;
	},

	updateCurrentUser: async (payload: {
		fullName: string;
		shippingAddress: string | null;
	}) => {
		const response = await privateApiRequest<User>({
			url: API_ENDPOINTS.USERS.ME,
			method: "PUT",
			data: payload,
		});

		const parsed = userSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("User data validation failed: ", { cause: parsed.error });
		}

		return parsed.data;
	},
};
