import type { Cart } from "../../features/cart/schemas/cartSchema";
import { type GuestCartItem } from "./GuestCartStore";
import type { CartService } from "../../features/cart/types/service";
import { cartService } from "./api";

class RemoteCartService implements CartService {
	getItems = async (): Promise<GuestCartItem[]> => {
		const cart = await cartService.getCart();
		return this.mapToCartItems(cart);
	};

	addItem = async (
		productId: string,
		quantity = 1,
	): Promise<GuestCartItem[]> => {
		const cart = await cartService.addToCart(productId, quantity);
		return this.mapToCartItems(cart);
	};

	updateQuantity = async (
		productId: string,
		quantity: number,
	): Promise<GuestCartItem[]> => {
		const cart = await cartService.updateCartItemQuantity(productId, quantity);
		return this.mapToCartItems(cart);
	};

	removeItem = async (productId: string): Promise<GuestCartItem[]> => {
		const cart = await cartService.removeFromCart(productId);
		return this.mapToCartItems(cart);
	};

	clear = async (): Promise<void> => {
		return await cartService.clearCart();
	};

	private mapToCartItems(cart: Cart): GuestCartItem[] {
		return cart.items.map((item) => ({
			productId: item.product.id,
			quantity: item.quantity,
		}));
	}
}

export const remoteCartService = new RemoteCartService();
