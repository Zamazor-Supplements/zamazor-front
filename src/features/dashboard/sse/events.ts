import type { QueryClient } from "@tanstack/react-query";

import { cartKeys } from "@/features/cart/services/keys";
import { dashboardKeys } from "@/features/dashboard/services/keys";
import { orderKeys } from "@/features/orders/services/keys";
import { categoryKeys } from "@/features/products/services/category/keys";
import { productKeys } from "@/features/products/services/product/keys";
import { wishlistKeys } from "@/features/wishlists/services/keys";
import { API_ENDPOINTS } from "@/app/config/apiEndpoints";

/** Admin SSE endpoint the backend streams catalog & order events from. */
export const ADMIN_EVENTS_ENDPOINT = API_ENDPOINTS.DASHBOARD.EVENTS;

/**
 * Events the dashboard consumes. `order.update` is kept as an alias of
 * `order.updated` so a backend emitting either spelling is handled.
 */
export const ADMIN_EVENT_NAMES = [
	"order.created",
	"order.updated",
	"order.update",
	"order.deleted",
	"product.created",
	"product.updated",
	"product.deleted",
	"category.created",
	"category.updated",
	"category.deleted",
] as const;

export type AdminEventName = (typeof ADMIN_EVENT_NAMES)[number];

/**
 * Central event → query keys mapping. Every key below exists verbatim in the
 * repo:
 *  - `orderKeys`    → features/orders/services/keys.ts  (lists, details, statuses, "me")
 *  - `productKeys`  → features/products/services/product/keys.ts
 *  - `categoryKeys` → features/products/services/category/keys.ts
 *  - `dashboardKeys`→ features/dashboard/services/keys.ts (overview / products / categories metrics)
 *  - `cartKeys` / `wishlistKeys` → features/{cart,wishlists}/services/keys.ts
 *    (their cached entities embed product snapshots, so product changes refresh them)
 *
 * Invalidating a parent key (e.g. `["orders"]`) refetches every active query
 * under it: all list pages/filters/sorts, details, counts and derived metrics.
 */
const EVENT_INVALIDATIONS: Record<
	AdminEventName,
	readonly (readonly unknown[])[]
> = {
	"order.created": [
		orderKeys.all, // order lists (all filters/pages), details, statuses, order history
		dashboardKeys.overview(), // counts, revenue, AOV, pending/in-flight, recent orders (sales chart)
		dashboardKeys.products(), // low-stock count may drop as stock is reserved
		productKeys.all, // reserved stock / availability reflected in product lists
	],
	"order.updated": [
		orderKeys.all,
		dashboardKeys.overview(),
		dashboardKeys.products(),
		productKeys.all,
	],
	"order.update": [
		orderKeys.all,
		dashboardKeys.overview(),
		dashboardKeys.products(),
		productKeys.all,
	],
	"order.deleted": [
		orderKeys.all,
		dashboardKeys.overview(),
		dashboardKeys.products(),
		productKeys.all,
	],
	"product.created": [
		productKeys.all, // lists, details, category-scoped lists, filters, bulk
		dashboardKeys.overview(), // top products, low-stock alerts, category summary
		dashboardKeys.products(), // product analytics cards
		dashboardKeys.categories(), // per-category product counts
		cartKeys.all, // cart lines embed product price/stock snapshots
		wishlistKeys.all, // wishlist embeds full product snapshots
	],
	"product.updated": [
		productKeys.all,
		dashboardKeys.overview(),
		dashboardKeys.products(),
		dashboardKeys.categories(),
		cartKeys.all,
		wishlistKeys.all,
	],
	"product.deleted": [
		productKeys.all,
		dashboardKeys.overview(),
		dashboardKeys.products(),
		dashboardKeys.categories(),
		cartKeys.all,
		wishlistKeys.all,
	],
	"category.created": [
		categoryKeys.all, // public category lists & details (filter dropdowns)
		dashboardKeys.categories(), // category analytics table
		dashboardKeys.overview(), // category summary mix
		dashboardKeys.products(), // product analytics (category counts)
		productKeys.all, // product rows embed the category label
	],
	"category.updated": [
		categoryKeys.all,
		dashboardKeys.categories(),
		dashboardKeys.overview(),
		dashboardKeys.products(),
		productKeys.all,
	],
	"category.deleted": [
		categoryKeys.all,
		dashboardKeys.categories(),
		dashboardKeys.overview(),
		dashboardKeys.products(),
		productKeys.all,
	],
};

/**
 * Resolve the effective event name from a named SSE event or, as a fallback,
 * from a plain `message` whose JSON payload carries a `type` field.
 */
export function resolveAdminEventName(
	eventName: string | null,
	raw: string,
): AdminEventName | null {
	const candidate = eventName ?? extractTypeFromPayload(raw);
	return ADMIN_EVENT_NAMES.includes(candidate as AdminEventName)
		? (candidate as AdminEventName)
		: null;
}

function extractTypeFromPayload(raw: string): string | null {
	try {
		const { type } = JSON.parse(raw) as { type?: unknown };
		return typeof type === "string" ? type : null;
	} catch {
		return null;
	}
}

/** Invalidate every query key registered for the given admin event. */
export async function invalidateQueriesForAdminEvent(
	queryClient: QueryClient,
	eventName: AdminEventName,
): Promise<void> {
	const queryKeys = EVENT_INVALIDATIONS[eventName];
	if (!queryKeys) return Promise.resolve();

	await Promise.all(
		queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
	);
	return undefined;
}
