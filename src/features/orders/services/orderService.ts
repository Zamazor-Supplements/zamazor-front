import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import {
	orderPageSchema,
	orderSchema,
	type Order,
	type OrderPage,
} from "../schemas/orderSchema";
import {
	paymentSessionResponseSchema,
	type PaymentSessionResponse,
} from "../schemas/paymentSchema";
export interface OrderPageQueryParams {
	page?: number;
	size?: number;
	status?: string;
	userFullName?: string;
	sort?: string | string[];
}

export type CheckoutRequest = {
	country: string;
	city: string;
	street: string;
	phone: string;
	isDefault: boolean;
};

export const orderService = {
	getUserOrders: async (params: OrderPageQueryParams = {}) => {
		const response = await privateApiRequest<OrderPage>({
			url: API_ENDPOINTS.ORDERS.ME,
			method: "GET",
			params,
		});

		const parsed = orderPageSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	getAllOrders: async (params: OrderPageQueryParams = {}) => {
		const response = await privateApiRequest<OrderPage>({
			url: API_ENDPOINTS.ORDERS.ROOT,
			method: "GET",
			params,
		});

		const parsed = orderPageSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	getOrderById: async (id: string) => {
		const response = await privateApiRequest<Order>({
			url: API_ENDPOINTS.ORDERS.DETAILS(id),
			method: "GET",
		});

		const parsed = orderSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	checkout: async (payload: CheckoutRequest) => {
		const response = await privateApiRequest<Order>({
			url: API_ENDPOINTS.ORDERS.CHECKOUT,
			method: "POST",
			data: payload,
		});

		const parsed = orderSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	getCheckoutPaymentUrl: async (orderId: string) => {
		const response = await privateApiRequest<PaymentSessionResponse>({
			url: API_ENDPOINTS.ORDERS.GET_PAYMENT_URL(orderId),
			method: "GET",
		});

		const parsed = paymentSessionResponseSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Payment Session data validation failed:", {
				cause: parsed.error,
			});
		}
		return parsed.data;
	},

	verifyCheckoutPayment: async (orderId: string, sessionId: string) => {
		const response = await privateApiRequest<Order>({
			url: API_ENDPOINTS.ORDERS.VERIFY_PAYMENT(orderId, sessionId),
			method: "GET",
		});

		const parsed = orderSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	cancelOrder: async (orderId: string) => {
		const response = await privateApiRequest<Order>({
			url: API_ENDPOINTS.ORDERS.CANCEL(orderId),
			method: "POST",
		});

		const parsed = orderSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	changeOrderStatus: async (orderId: string, status: string) => {
		const response = await privateApiRequest<Order>({
			url: API_ENDPOINTS.ORDERS.STATUS(orderId),
			method: "PATCH",
			data: { status },
		});

		const parsed = orderSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Order data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},
};
