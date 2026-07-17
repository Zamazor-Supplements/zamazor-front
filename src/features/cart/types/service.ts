import type { CartSummary } from "../schemas/cartSchema";
import type { GuestCartItem } from "../../../services/cart/GuestCartStore";

export interface CartService {
	getItems(): Promise<GuestCartItem[]>;
	addItem(productId: string, quantity?: number): Promise<GuestCartItem[]>;
	updateQuantity(productId: string, quantity: number): Promise<GuestCartItem[]>;
	removeItem(productId: string): Promise<GuestCartItem[]>;
	clear(): Promise<void>;
}

export interface CartSummaryService {
	getSummary(guestItems?: GuestCartItem[]): Promise<CartSummary>;
}
