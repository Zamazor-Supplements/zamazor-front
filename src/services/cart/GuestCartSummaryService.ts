import { productService } from "@/features/products/services/productService";
import type {
	GuestCartSummary,
	PopulatedCartItem,
} from "../../features/cart/schemas/cartSchema";
import { type GuestCartItem } from "./GuestCartStore";
import type { CartSummaryService } from "../../features/cart/types/service";

class GuestCartSummaryService implements CartSummaryService {
	async getSummary(items: GuestCartItem[] = []): Promise<GuestCartSummary> {
		if (items.length === 0) return this.emptyCartSummary();

		const productIds = items.map((i) => i.productId);
		const products = await productService.bulkProducts(productIds);

		const productMap = new Map(products.map((p) => [p.id, p]));
		const populatedCartItems: PopulatedCartItem[] = [];
		let subtotal = 0;

		for (const item of items) {
			const product = productMap.get(item.productId);

			if (product) {
				populatedCartItems.push({
					product,
					quantity: item.quantity,
				});
				subtotal += product.price * item.quantity;
			}
		}

		return {
			items: populatedCartItems,
			subtotal,
			tax: null,
			shipping: null,
			discount: null,
			total: subtotal,
		};
	}

	private emptyCartSummary(): GuestCartSummary {
		return {
			items: [],
			subtotal: 0,
			tax: null,
			shipping: null,
			discount: null,
			total: 0,
		};
	}
}

export const guestCartSummaryService = new GuestCartSummaryService();
