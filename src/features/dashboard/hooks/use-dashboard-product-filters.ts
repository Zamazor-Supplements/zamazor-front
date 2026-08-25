/**
 * URL-synced filter state for the Dashboard → Products page.
 *
 * Reads initial values from `?search=`, `?category=`, `?sort=`, `?page=`
 * and writes changes back via `useSearchParams` (replace), so deep links,
 * browser back/forward, and URL sharing all preserve the current view.
 */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router";

export type DashboardProductSort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "name,asc"
	| "name,desc"
	| "price,asc"
	| "price,desc";

export interface DashboardProductFilters {
	search: string;
	categoryId: string;
	sort: DashboardProductSort;
	page: number;
}

const DEFAULT_FILTERS: DashboardProductFilters = {
	search: "",
	categoryId: "",
	sort: "createdAt,desc",
	page: 0,
};

const PAGE_SIZE = 6;

const VALID_SORTS: readonly DashboardProductSort[] = [
	"createdAt,desc",
	"createdAt,asc",
	"name,asc",
	"name,desc",
	"price,asc",
	"price,desc",
] as const;

function readFilters(params: URLSearchParams): DashboardProductFilters {
	const sortRaw = params.get("sort");
	const sort: DashboardProductSort =
		sortRaw && (VALID_SORTS as readonly string[]).includes(sortRaw)
			? (sortRaw as DashboardProductSort)
			: DEFAULT_FILTERS.sort;

	const pageRaw = params.get("page");
	const pageNum = pageRaw ? Number(pageRaw) : 0;

	return {
		search: params.get("search") ?? "",
		categoryId: params.get("category") ?? "",
		sort,
		page: Number.isFinite(pageNum) && pageNum >= 0 ? Math.floor(pageNum) : 0,
	};
}

export interface UseDashboardProductFiltersReturn {
	filters: DashboardProductFilters;
	updateFilters: (next: Partial<DashboardProductFilters>) => void;
	setPage: (page: number) => void;
	resetFilters: () => void;
	isFilterActive: boolean;
}

export function useDashboardProductFilters(): UseDashboardProductFiltersReturn {
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(
		() => readFilters(searchParams),
		[searchParams],
	);

	// Keep a ref so functional updates never read stale state.
	const filtersRef = useRef(filters);
	useEffect(() => {
		filtersRef.current = filters;
	}, [filters]);

	const writeFilters = useCallback(
		(next: DashboardProductFilters) => {
			const params = new URLSearchParams(searchParams);

			const setOrDelete = (key: string, value: string | undefined) => {
				if (value) params.set(key, value);
				else params.delete(key);
			};

			setOrDelete("search", next.search);
			setOrDelete("category", next.categoryId);
			setOrDelete("sort", next.sort);
			setOrDelete("page", next.page > 0 ? String(next.page) : undefined);

			setSearchParams(params, { replace: true });
		},
		[searchParams, setSearchParams],
	);

	const updateFilters = useCallback(
		(next: Partial<DashboardProductFilters>) => {
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
		Boolean(filters.search.trim()) ||
		Boolean(filters.categoryId) ||
		filters.sort !== DEFAULT_FILTERS.sort;

	return {
		filters,
		updateFilters,
		setPage,
		resetFilters,
		isFilterActive,
	};
}

export const DASHBOARD_PRODUCT_DEFAULTS = DEFAULT_FILTERS;
export const DASHBOARD_PRODUCT_PAGE_SIZE = PAGE_SIZE;