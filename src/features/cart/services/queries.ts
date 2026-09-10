import { useQuery } from "@tanstack/react-query";
import { useGuestCartStore } from "../stores/guestCartStore";
import { useIsAuthenticated } from "@/features/auth/services/queries";
import { cartKeys } from "./keys";
import { getCart } from "./api";
import { useBulkProducts } from "@/features/products/services/product/queries";
import { useMemo } from "react";
import type { GuestCart } from "../schemas/cartSchema";

/**
 * Hook to fetch the main authenticated cart.
 */
function useAuthenticatedCart(authenticated: boolean) {
	return useQuery({
		queryKey: cartKeys.all,
		queryFn: getCart,
		enabled: authenticated,
	});
}

const EMPTY_CART: GuestCart = {
	id: null,
	items: [],
	subtotal: 0,
	tax: null,
	shipping: null,
	discount: null,
	total: 0,
};

function useGuestCart(authenticated: boolean) {
	const items = useGuestCartStore((s) => s.items);
	const hydrated = useGuestCartStore((s) => s.isHydrated);

	const productIds = [...new Set(items.map((i) => i.productId))];

	const { data: products = [], ...query } = useBulkProducts(productIds, {
		enabled: productIds.length > 0 && !authenticated && hydrated,
	});

	const summary = useMemo(() => {
		const productMap = new Map(products.map((p) => [p.id, p]));

		return items.reduce((acc, item) => {
			const product = productMap.get(item.productId);
			if (!product) return acc;

			const lineTotal = product.price * item.quantity;

			return {
				...acc,
				items: [
					...acc.items,
					{
						id: null,
						product,
						quantity: item.quantity,
					},
				],
				subtotal: acc.subtotal + lineTotal,
				total: acc.total + lineTotal,
			};
		}, EMPTY_CART);
	}, [items, products]);

	return {
		...query,
		data: summary,
	};
}

export function useCart() {
	const authenticated = useIsAuthenticated();

	const authCart = useAuthenticatedCart(authenticated);
	const guestCart = useGuestCart(authenticated);

	return authenticated ? authCart : guestCart;
}

export function useCartCount() {
	const authenticated = useIsAuthenticated();
	const { data: cart } = useAuthenticatedCart(authenticated);

	const guestItems = useGuestCartStore((s) => s.items);
	const hydrated = useGuestCartStore((s) => s.isHydrated);

	if (authenticated) {
		return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
	}

	if (!hydrated) {
		return 0;
	}

	return guestItems.reduce((sum, item) => sum + item.quantity, 0);
}
