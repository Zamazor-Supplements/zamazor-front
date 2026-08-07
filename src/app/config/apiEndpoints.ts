export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: "/auth/login",
		REGISTER: "/auth/register",
		LOGOUT: "/auth/logout",
		REFRESH: "/auth/refresh",
		ME: "/auth/me",
	},
	USERS: {
		ROOT: "/users",
		ME: "/users/me",
		DETAILS: (id: string) => `/users/${id}`,
	},
	PRODUCTS: {
		ROOT: "/products",
		BULK: "/products/bulk",
		DETAILS: (id: string) => `/products/${id}`,
		CATEGORY: (id: string) => `/products/category/${id}`,
		SEARCH: (query: string) =>
			`/products/search?q=${encodeURIComponent(query)}`,
	},
	CATEGORIES: {
		ROOT: "/categories",
		DETAILS: (id: string) => `/categories/${id}`,
	},
	DASHBOARD: {
		OVERVIEW: "/dashboard/overview",
		CATEGORY: "/dashboard/category",
		PRODUCT: "/dashboard/product",
	},
	CARTS: {
		ROOT: "/carts",
		SYNC: "/carts/sync",
		ITEMS: "/carts/items",
		ITEM_DETAILS: (itemId: string) => `/carts/items/${itemId}`,
	},
	ADDRESSES: {
		ROOT: "/addresses",
	},
	WISHLISTS: {
		ROOT: "/wishlists",
		SYNC: "/wishlists/sync",
		DETAILS: (productId: string) => `/wishlists/${productId}`,
	},
	ORDERS: {
		ROOT: "/orders",
		ME: "/orders/me",
		DETAILS: (id: string) => `/orders/${id}`,
		CANCEL: (id: string) => `/orders/${id}/cancel`,
		STATUS: (id: string) => `/orders/${id}/status`,
		CHECKOUT: "/orders/checkout",
		GET_PAYMENT_URL: (orderId: string) => `/orders/checkout/${orderId}/pay`,
		VERIFY_PAYMENT: (
			orderId: string,
			sessionId: string,
		) =>
			`/orders/checkout/${orderId}/verify?sessionId=${encodeURIComponent(sessionId)}`,
	},
} as const;
