import { API_ENDPOINTS } from "@/core/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import {
	wishlistSchema,
	type Wishlist,
} from "@/features/wishlists/schemas/wishlistSchema";
import type { Product } from "../schemas/productSchema";

export const wishlistService = {
	getWishlist: async (): Promise<Product[]> => {
		const response = await privateApiRequest<Wishlist>(
			{
				url: API_ENDPOINTS.WISHLISTS.ROOT,
				method: "GET",
			},
			{ ignoreErrors: true },
		);

		const parsed = wishlistSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("wishlist data validation failed: ", {
				cause: parsed.error,
			});
		}
		return mapToWishlistProducts(parsed.data);
	},

	syncWishlist: async (ids: string[]): Promise<Product[]> => {
		if (ids.length === 0) return [];

		const response = await privateApiRequest<Wishlist>({
			url: API_ENDPOINTS.WISHLISTS.SYNC,
			method: "POST",
			data: { ids },
		});

		const parsed = wishlistSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Wishlist data validation failed:", {
				cause: parsed.error,
			});
		}
		return mapToWishlistProducts(parsed.data);
	},

	toggleToWishlist: async (productId: string): Promise<Product[]> => {
		const response = await privateApiRequest<Wishlist>({
			url: API_ENDPOINTS.WISHLISTS.DETAILS(productId),
			method: "POST",
		});

		const parsed = wishlistSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("wishlist data validation failed: ", {
				cause: parsed.error,
			});
		}

		return mapToWishlistProducts(parsed.data);
	},

	clearWishlist: async (): Promise<void> => {
		return await privateApiRequest<void>({
			url: API_ENDPOINTS.WISHLISTS.ROOT,
			method: "DELETE",
		});
	},
};

function mapToWishlistProducts(wishlist: Wishlist): Product[] {
	return wishlist.items.map((item) => item.product);
}
