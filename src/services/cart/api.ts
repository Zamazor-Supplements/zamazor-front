import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import {
	cartSchema,
	cartSummarySchema,
	type Cart,
	type CartSummary,
	type GuestCartSummary,
} from "../../features/cart/schemas/cartSchema";
import { publicApiRequest } from "@/shared/utils/axiosPublic";
import type { GuestCartItem } from "./GuestCartStore";

async function getCartSummary(): Promise<CartSummary>;
async function getCartSummary(
	isLoggedIn: boolean,
	items: GuestCartItem[],
): Promise<CartSummary>;

async function getCartSummary(isLoggedIn = true, items: GuestCartItem[] = []) {
	const response = isLoggedIn
		? await privateApiRequest<CartSummary>({
				url: API_ENDPOINTS.CARTS.SUMMARY,
				method: "GET",
			})
		: await publicApiRequest<GuestCartSummary>({
				url: API_ENDPOINTS.CARTS.SUMMARY,
				method: "POST",
				data: { items },
			});

	const parsed = cartSummarySchema.safeParse(response);
	if (!parsed.success) {
		throw new Error(
			`Cart Summary data validation failed: ${parsed.error.message}`,
			{
				cause: parsed.error,
			},
		);
	}

	return parsed.data;
}

export const cartService = {
	syncCart: async (items: GuestCartItem[]) => {
		const response = await privateApiRequest<Cart>({
			url: API_ENDPOINTS.CARTS.SYNC,
			method: "POST",
			data: { items },
		});

		const parsed = cartSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Cart data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	getCartSummary,

	getCart: async () => {
		const response = await privateApiRequest<Cart>(
			{
				url: API_ENDPOINTS.CARTS.ROOT,
				method: "GET",
			},
			{ ignoreErrors: true },
		);

		const parsed = cartSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Cart data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	addToCart: async (productId: string, quantity: number) => {
		const response = await privateApiRequest<Cart>({
			url: API_ENDPOINTS.CARTS.ITEMS,
			method: "POST",
			data: { productId, quantity },
		});

		const parsed = cartSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Cart data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	removeFromCart: async (productId: string) => {
		const response = await privateApiRequest<Cart>({
			url: API_ENDPOINTS.CARTS.ITEM_DETAILS(productId),
			method: "DELETE",
		});

		const parsed = cartSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Cart data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	updateCartItemQuantity: async (productId: string, quantity: number) => {
		const response = await privateApiRequest<Cart>({
			url: API_ENDPOINTS.CARTS.ITEM_DETAILS(productId),
			method: "PATCH",
			data: { quantity },
		});

		const parsed = cartSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Cart data validation failed:", { cause: parsed.error });
		}
		return parsed.data;
	},

	clearCart: async () => {
		return await privateApiRequest<void>({
			url: API_ENDPOINTS.CARTS.ROOT,
			method: "DELETE",
		});
	},
};
