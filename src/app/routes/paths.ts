type AutoComplete<T extends string> = T | (string & {});

export const APP_ROUTES = {
	HOME: "/",
	PRODUCT: (id: AutoComplete<":id">) => `/product/${id}`,
	SHOP: "/shop",
	CART: "/cart",
	CHECKOUT: {
		ROOT: "/checkout",
		SUCCESS: (orderId: AutoComplete<":orderId">) =>
			`/checkout/orders/${orderId}/success`,
		CANCEL: (orderId: AutoComplete<":orderId">) =>
			`/checkout/orders/${orderId}/cancel`,
	},
	DASHBOARD: {
		ROOT: "/dashboard",
		PRODUCTS: "/dashboard/products",
		CATEGORIES: "/dashboard/categories",
		ORDERS: "/dashboard/orders",
		SETTINGS: "/dashboard/settings",
	},
	USER: {
		PROFILE: "/profile",
		ORDERS: "/profile/orders",
		WISHLIST: "/wishlist",
	},
	AUTH: {
		LOGIN: "/login",
		REGISTER: "/register",
		FORGOT_PASSWORD: "/forgot-password",
		RESET_PASSWORD: "/reset-password",
	},
	PAGES: {
		ABOUT: "/story",
		CONTACT: "/contact",
		FAQ: "/faq",
		RETURNS: "/returns",
		SHIPPING: "/shipping",
		HELP: "/help",
		TERMS: "/terms",
		PRIVACY: "/privacy",
		ACCESSIBILITY: "/accessibility",
	},
	NOT_FOUND: "*",
} as const;
