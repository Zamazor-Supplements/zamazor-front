import type { GuestStoreCartItem } from "../stores/guestCartStore";

export interface CartService {
	getItems(): Promise<GuestStoreCartItem[]>;
	addItem(productId: string, quantity?: number): Promise<GuestStoreCartItem[]>;
	updateQuantity(
		productId: string,
		quantity: number,
	): Promise<GuestStoreCartItem[]>;
	removeItem(productId: string): Promise<GuestStoreCartItem[]>;
	clear(): Promise<void>;
}
