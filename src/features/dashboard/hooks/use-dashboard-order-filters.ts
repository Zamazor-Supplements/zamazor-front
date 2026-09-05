/**
 * URL-synced filter state for the Dashboard → Orders page.
 *
 * Reads initial values from `?search=`, `?status=`, `?sort=`, `?page=`
 * and writes changes back via `useSearchParams` (replace), so deep links,
 * browser back/forward, and URL sharing all preserve the current view.
 */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import {
	ORDER_STATUS_META,
	type OrderStatus,
	type OrderStatusFilter,
} from "@/features/orders/constants/orderStatus";

export type OrderSort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "total,desc"
	| "total,asc"
	| "status,asc";

export interface OrderFilters {
	search: string | undefined;
	status: OrderStatusFilter;
	sort: OrderSort;
	page: number;
}

const DEFAULT_FILTERS: OrderFilters = {
	search: undefined,
	status: undefined,
	sort: "createdAt,desc",
	page: 0,
};

const PAGE_SIZE = 6;

const VALID_SORTS: readonly OrderSort[] = [
	"createdAt,desc",
	"createdAt,asc",
	"total,desc",
	"total,asc",
	"status,asc",
] as const;

function isOrderStatus(value: string): value is OrderStatus {
	return value in ORDER_STATUS_META;
}

function readFilters(params: URLSearchParams): OrderFilters {
	const sortRaw = params.get("sort");
	const sort: OrderSort =
		sortRaw && (VALID_SORTS as readonly string[]).includes(sortRaw)
			? (sortRaw as OrderSort)
			: DEFAULT_FILTERS.sort;

	const statusRaw = params.get("status");
	const status: OrderStatusFilter =
		statusRaw && isOrderStatus(statusRaw) ? statusRaw : undefined;

	const pageRaw = params.get("page");
	const pageNum = pageRaw ? Number(pageRaw) : 0;

	return {
		search: params.get("search") ?? undefined,
		status,
		sort,
		page: Number.isFinite(pageNum) && pageNum >= 0 ? Math.floor(pageNum) : 0,
	};
}

export interface UseDashboardOrderFiltersReturn {
	filters: OrderFilters;
	updateFilters: (next: Partial<OrderFilters>) => void;
	setPage: (page: number) => void;
	resetFilters: () => void;
	isFilterActive: boolean;
}

export function useDashboardOrderFilters(): UseDashboardOrderFiltersReturn {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(() => readFilters(searchParams), [searchParams]);

	// Keep a ref so functional updates never read stale state.
	const filtersRef = useRef(filters);
	useEffect(() => {
		filtersRef.current = filters;
	}, [filters]);

	const writeFilters = useCallback(
		(next: OrderFilters) => {
			const params = new URLSearchParams(searchParams);

			const setOrDelete = (key: string, value: string | undefined) => {
				if (value) params.set(key, value);
				else params.delete(key);
			};

			setOrDelete("search", next.search);
			setOrDelete("status", next.status || undefined);
			setOrDelete("sort", next.sort);
			setOrDelete("page", next.page > 0 ? String(next.page) : undefined);

			setSearchParams(params, { replace: true });
		},
		[searchParams, setSearchParams],
	);

	const updateFilters = (next: Partial<OrderFilters>) => {
		writeFilters({ ...filtersRef.current, ...next });
	};

	const setPage = (page: number) => {
		updateFilters({ page });
	};

	const resetFilters = useCallback(() => {
		writeFilters(DEFAULT_FILTERS);
	}, [writeFilters]);

	const isFilterActive =
		Boolean(filters.search?.trim()) ||
		Boolean(filters.status) ||
		filters.sort !== DEFAULT_FILTERS.sort;

	return {
		filters,
		updateFilters,
		setPage,
		resetFilters,
		isFilterActive,
	};
}

export const DASHBOARD_ORDER_DEFAULTS = DEFAULT_FILTERS;
export const DASHBOARD_ORDER_PAGE_SIZE = PAGE_SIZE;
