import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { cartSchema, type Cart } from "../schemas/cartSchema";
import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import type { GuestStoreCartItem } from "../stores/guestCartStore";
import { parseResponse } from "@/shared/utils/parseResponse";

export const getCart = async () => {
	const response = await privateApiRequest<Cart>(
		{
			url: API_ENDPOINTS.CARTS.ROOT,
			method: "GET",
		},
		{ ignoreErrors: true },
	);

	return parseResponse(response, cartSchema, "Cart validation failed");
};

export const addToCart = async (productId: string, quantity: number) => {
	const response = await privateApiRequest<Cart>({
		url: API_ENDPOINTS.CARTS.ITEMS,
		method: "POST",
		data: { productId, quantity },
	});

	return parseResponse(response, cartSchema, "Cart validation failed");
};

export const removeFromCart = async (productId: string) => {
	const response = await privateApiRequest<Cart>({
		url: API_ENDPOINTS.CARTS.ITEM_DETAILS(productId),
		method: "DELETE",
	});

	return parseResponse(response, cartSchema, "Cart validation failed");
};

export const updateCartItemQuantity = async (
	productId: string,
	quantity: number,
) => {
	const response = await privateApiRequest<Cart>({
		url: API_ENDPOINTS.CARTS.ITEM_DETAILS(productId),
		method: "PATCH",
		data: { quantity },
	});

	return parseResponse(response, cartSchema, "Cart validation failed");
};

export const clearCart = async () => {
	return await privateApiRequest<void>({
		url: API_ENDPOINTS.CARTS.ROOT,
		method: "DELETE",
	});
};

export const syncCart = async (items: GuestStoreCartItem[]) => {
	const response = await privateApiRequest<Cart>({
		url: API_ENDPOINTS.CARTS.SYNC,
		method: "POST",
		data: { items },
	});

	return parseResponse(response, cartSchema, "Cart validation failed");
};
