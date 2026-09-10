import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import {
	orderPageSchema,
	orderSchema,
	type Order,
	type OrderPage,
} from "../schemas/orderSchema";
import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import type { CheckoutFormValues } from "../schemas/checkoutSchema";
import {
	paymentSessionResponseSchema,
	type PaymentSessionResponse,
} from "../schemas/paymentSchema";
import { parseResponse } from "@/shared/utils/parseResponse";
import type { OrderStatus } from "../constants/orderStatus";

export interface OrderPageQueryParams {
	page?: number | undefined;
	size?: number | undefined;
	status?: OrderStatus | undefined;
	userFullName?: string | undefined;
	sort?: string | string[] | undefined;
}

export const getUserOrders = async (params: OrderPageQueryParams = {}) => {
	const response = await privateApiRequest<OrderPage>({
		url: API_ENDPOINTS.ORDERS.ME,
		method: "GET",
		params,
	});

	return parseResponse(
		response,
		orderPageSchema,
		"Orders data validation failed",
	);
};

export const getAllOrders = async (params: OrderPageQueryParams = {}) => {
	const response = await privateApiRequest<OrderPage>({
		url: API_ENDPOINTS.ORDERS.ROOT,
		method: "GET",
		params,
	});

	return parseResponse(
		response,
		orderPageSchema,
		"Orders data validation failed",
	);
};

export const getOrderById = async (id: string) => {
	const response = await privateApiRequest<Order>({
		url: API_ENDPOINTS.ORDERS.DETAILS(id),
		method: "GET",
	});

	return parseResponse(response, orderSchema, "Order data validation failed");
};

export const checkout = async (payload: CheckoutFormValues) => {
	const response = await privateApiRequest<Order>({
		url: API_ENDPOINTS.ORDERS.CHECKOUT,
		method: "POST",
		data: payload,
	});

	return parseResponse(response, orderSchema, "Order data validation failed");
};

export const generateCheckoutPaymentUrl = async (orderId: string) => {
	const response = await privateApiRequest<PaymentSessionResponse>({
		url: API_ENDPOINTS.ORDERS.GET_PAYMENT_URL(orderId),
		method: "POST",
	});

	return parseResponse(
		response,
		paymentSessionResponseSchema,
		"Payment Session data validation failed",
	);
};

export const verifyCheckoutPayment = async (
	orderId: string,
) => {
	const response = await privateApiRequest<Order>({
		url: API_ENDPOINTS.ORDERS.VERIFY_PAYMENT(orderId),
		method: "GET",
	});

	return parseResponse(response, orderSchema, "Order data validation failed");
};

export const cancelOrder = async (orderId: string) => {
	const response = await privateApiRequest<Order>({
		url: API_ENDPOINTS.ORDERS.CANCEL(orderId),
		method: "POST",
	});

	return parseResponse(response, orderSchema, "Order data validation failed");
};

export const changeOrderStatus = async (
	orderId: string,
	status: OrderStatus,
) => {
	const response = await privateApiRequest<Order>({
		url: API_ENDPOINTS.ORDERS.STATUS(orderId),
		method: "PATCH",
		data: { status },
	});

	return parseResponse(response, orderSchema, "Order data validation failed");
};
