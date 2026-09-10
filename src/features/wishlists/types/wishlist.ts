import type { GuestWishlist } from "../stores/guestWishlistStore";

export interface WishlistService {
	getItems(): Promise<GuestWishlist>;
	toggleItem(productId: string): Promise<GuestWishlist>;
	clear(): Promise<void>;
}
