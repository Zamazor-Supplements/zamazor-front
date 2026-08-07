import type { GuestCartItem } from "../stores/guestCartStore";

export interface CartService {
	getItems(): Promise<GuestCartItem[]>;
	addItem(productId: string, quantity?: number): Promise<GuestCartItem[]>;
	updateQuantity(productId: string, quantity: number): Promise<GuestCartItem[]>;
	removeItem(productId: string): Promise<GuestCartItem[]>;
	clear(): Promise<void>;
}
