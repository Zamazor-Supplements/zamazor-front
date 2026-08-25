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

export type DashboardOrderSort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "total,desc"
	| "total,asc"
	| "status,asc";

export interface DashboardOrderFilters {
	search: string | undefined;
	status: OrderStatusFilter;
	sort: DashboardOrderSort;
	page: number;
}

const DEFAULT_FILTERS: DashboardOrderFilters = {
	search: undefined,
	status: undefined,
	sort: "createdAt,desc",
	page: 0,
};

const PAGE_SIZE = 6;

const VALID_SORTS: readonly DashboardOrderSort[] = [
	"createdAt,desc",
	"createdAt,asc",
	"total,desc",
	"total,asc",
	"status,asc",
] as const;

function isOrderStatus(value: string): value is OrderStatus {
	return value in ORDER_STATUS_META;
}

function readFilters(params: URLSearchParams): DashboardOrderFilters {
	const sortRaw = params.get("sort");
	const sort: DashboardOrderSort =
		sortRaw && (VALID_SORTS as readonly string[]).includes(sortRaw)
			? (sortRaw as DashboardOrderSort)
			: DEFAULT_FILTERS.sort;

	const statusRaw = params.get("status");
	const status: OrderStatusFilter =
		statusRaw && isOrderStatus(statusRaw) ? statusRaw : undefined;

	const pageRaw = params.get("page");
	const pageNum = pageRaw ? Number(pageRaw) : 0;

	return {
		search: params.get("search") ?? "",
		status,
		sort,
		page: Number.isFinite(pageNum) && pageNum >= 0 ? Math.floor(pageNum) : 0,
	};
}

export interface UseDashboardOrderFiltersReturn {
	filters: DashboardOrderFilters;
	updateFilters: (next: Partial<DashboardOrderFilters>) => void;
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
		(next: DashboardOrderFilters) => {
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

	const updateFilters = useCallback(
		(next: Partial<DashboardOrderFilters>) => {
			writeFilters({ ...filtersRef.current, ...next });
		},
		[writeFilters],
	);

	const setPage = useCallback(
		(page: number) => {
			updateFilters({ page });
		},
		[updateFilters],
	);

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
