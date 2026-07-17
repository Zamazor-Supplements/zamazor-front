// import { useState, useMemo, useEffect } from "react";
// import type { CategoryAnalytics } from "../schemas/dashboardSchema";
// import { categoryService } from "@/features/products/services/categoryService";

// interface ConfirmState {
// 	isOpen: boolean;
// 	title: string | undefined;
// 	description: string | undefined;
// 	confirmText: string;
// 	isDestructive: boolean;
// 	onConfirm: () => void | Promise<void>;
// }

// const initialConfirmState: ConfirmState = {
// 	isOpen: false,
// 	title: undefined,
// 	description: undefined,
// 	confirmText: "Continue",
// 	isDestructive: false,
// 	onConfirm: () => {},
// };

// function useDebounce<T>(value: T, delay: number): T {
// 	const [debouncedValue, setDebouncedValue] = useState<T>(value);

// 	useEffect(() => {
// 		const handler = setTimeout(() => {
// 			setDebouncedValue(value);
// 		}, delay);

// 		return () => clearTimeout(handler);
// 	}, [value, delay]);

// 	return debouncedValue;
// }

// export function useCategoryTable({
// 	analytics = [],
// 	pageSize = 8,
// }: {
// 	analytics: CategoryAnalytics;
// 	pageSize: number;
// }) {
// 	const [search, setSearch] = useState<string | undefined>(undefined);
// 	const debouncedSearch = useDebounce(search?.trim(), 500);

// 	const [sortBy, setSortBy] = useState("label,asc");
// 	const [page, setPage] = useState(1);
// 	const [confirmState, setConfirmState] =
// 		useState<ConfirmState>(initialConfirmState);

// 	const totalPages = analytics;
// 	const safePage = Math.min(page, totalPages);

// 	// UI display string index counters
// 	const startItemIndex =
// 		analytics.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
// 	const endItemIndex = Math.min(safePage * pageSize, analytics.length);

// 	const closeConfirm = () => setConfirmState(initialConfirmState);

// 	const triggerDelete = (category: CategoryAnalytics[number]) => {
// 		const isLinked = category.productCount > 0;

// 		setConfirmState({
// 			isOpen: true,
// 			title: "Delete Category",
// 			description: isLinked
// 				? `Delete "${category.label}"? This category is currently linked to ${category.productCount} product(s).`
// 				: `Delete "${category.label}"? This action cannot be undone.`,
// 			confirmText: "Delete",
// 			isDestructive: true,
// 			onConfirm: async () => {
// 				await categoryService.deleteCategory(category.id);

// 				// if (!isSystemError(response)) {
// 				// 	loadData();
// 				// }
// 				closeConfirm();
// 			},
// 		});
// 	};

// 	const resetFilters = () => {
// 		setSearch(undefined);
// 		setSortBy("label,asc");
// 		setPage(1);
// 	};

// 	return {
// 		search,
// 		setSearch,
// 		sortBy,
// 		setSortBy,
// 		page: safePage,
// 		setPage,
// 		totalPages,
// 		paginatedCategories,
// 		filteredCount: filteredCategories.length,
// 		startItemIndex,
// 		endItemIndex,
// 		confirmState,
// 		closeConfirm,
// 		triggerDelete,
// 		resetFilters,
// 	};
// }
