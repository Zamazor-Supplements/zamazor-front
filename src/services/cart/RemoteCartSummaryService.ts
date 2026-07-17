import type { CartSummary } from "../../features/cart/schemas/cartSchema";
import type { CartSummaryService } from "../../features/cart/types/service";
import { cartService } from "./api";

class RemoteCartSummaryService implements CartSummaryService {
	async getSummary(): Promise<CartSummary> {
		const cart = await cartService.getCart();
		const baseItems = cart.items.map((i) => ({
			product: i.product,
			quantity: i.quantity,
		}));

		if (cart.tax === null || cart.shipping === null || cart.discount === null) {
			return {
				items: baseItems,
				subtotal: cart.subtotal,
				tax: null,
				shipping: null,
				discount: null,
				total: cart.subtotal,
			};
		}

		return {
			items: baseItems,
			subtotal: cart.subtotal,
			tax: cart.tax,
			shipping: cart.shipping,
			discount: cart.discount,
			total: cart.total,
		};
	}
}

export const remoteCartSummaryService = new RemoteCartSummaryService();
