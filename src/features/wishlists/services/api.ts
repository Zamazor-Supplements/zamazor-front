import { API_ENDPOINTS } from "@/app/config/apiEndpoints";
import { privateApiRequest } from "@/shared/utils/axiosPrivate";
import { wishlistSchema, type Wishlist } from "../schemas/wishlistSchema";
import { parseResponse } from "@/shared/utils/parseResponse";
import type { Product } from "@/features/products/schemas/productSchema";

export const getWishlistIds = async () => {
	const response = await privateApiRequest<Wishlist>(
		{
			url: API_ENDPOINTS.WISHLISTS.ROOT,
			method: "GET",
		},
		{ ignoreErrors: true },
	);

	return mapToWishlistProductIds(
		parseResponse(response, wishlistSchema, "Wishlist data validation failed"),
	);
};

export const getWishlist = async () => {
	const response = await privateApiRequest<Wishlist>(
		{
			url: API_ENDPOINTS.WISHLISTS.ROOT,
			method: "GET",
		},
		{ ignoreErrors: true },
	);

	return mapToWishlistProducts(
		parseResponse(response, wishlistSchema, "Wishlist data validation failed"),
	);
};

export const syncWishlist = async (ids: string[]) => {
	const response = await privateApiRequest<Wishlist>({
		url: API_ENDPOINTS.WISHLISTS.SYNC,
		method: "POST",
		data: { ids },
	});

	return mapToWishlistProducts(
		parseResponse(response, wishlistSchema, "Wishlist data validation failed"),
	);
};

export const toggleWishlist = async (productId: string) => {
	const response = await privateApiRequest<Wishlist>({
		url: API_ENDPOINTS.WISHLISTS.DETAILS(productId),
		method: "POST",
	});

	return mapToWishlistProducts(
		parseResponse(response, wishlistSchema, "Wishlist data validation failed"),
	);
};

export const clearWishlist = () =>
	privateApiRequest<void>({
		url: API_ENDPOINTS.WISHLISTS.ROOT,
		method: "DELETE",
	});

function mapToWishlistProducts(wishlist: Wishlist): Product[] {
	return wishlist.items.map((item) => item.product);
}

function mapToWishlistProductIds(wishlist: Wishlist): string[] {
	return wishlist.items.map((item) => item.product.id);
}
