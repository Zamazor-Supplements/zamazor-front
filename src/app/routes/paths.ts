// type AutoComplete<T extends string> = T | (string & {});

type PathParams<TPath extends string> =
	TPath extends `${string}:${infer Param}/${infer Rest}`
		? { [K in Param | keyof PathParams<`/${Rest}`>]: string }
		: TPath extends `${string}:${infer Param}`
			? { [K in Param]: string }
			: Record<never, never>;


type ReplaceParams<
	TPath extends string,
	TParams extends Record<string, string>,
> = TPath extends `${infer Start}:${infer Param}/${infer Rest}`
	? Param extends keyof TParams
		? `${Start}${TParams[Param]}/${ReplaceParams<`/${Rest}`, TParams> extends `/${infer R}` ? R : never}`
		: TPath
	: TPath extends `${infer Start}:${infer Param}`
		? Param extends keyof TParams
			? `${Start}${TParams[Param]}`
			: TPath
		: TPath;

type Route<TPath extends string> = {
	(): TPath;
	<TParams extends PathParams<TPath>>(
		params: TParams,
	): ReplaceParams<TPath, TParams>;
};

const createRoute = <const TPath extends string>(
	path: TPath,
): Route<TPath> => {
	const route = (params?: Record<string, string>) =>
		params
			? path.replace(
					/:([a-zA-Z0-9_]+)/g,
					(_, key: string) => params[key] ?? `:${key}`,
				)
			: path;

	return route as Route<TPath>;
};

export const APP_ROUTES = {
	HOME: "/",
	PRODUCT: createRoute("/product/:id"),
	SHOP: "/shop",
	CART: "/cart",
	CHECKOUT: {
		ROOT: "/checkout",
		SUCCESS: createRoute("/checkout/orders/:orderId/success"),
		CANCEL: createRoute("/checkout/orders/:orderId/cancel"),
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
