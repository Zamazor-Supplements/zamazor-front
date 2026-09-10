import { useMemo, useState } from "react";
import type { Category } from "@/features/products/schemas/categorySchema";
import type { DashboardProductSort } from "../../hooks/use-dashboard-product-filters";
import { ResetFiltersButton } from "../shared/ResetFiltersButton";
import { ResultsSummary } from "../shared/ResultsSummary";
import { ToolbarSearchInput } from "../shared/ToolbarSearchInput";
import {
	ToolbarSelect,
	type ToolbarSelectOption,
} from "../shared/ToolbarSelect";

export type ProductFilters = {
	search: string | undefined;
	categoryId: string;
};

const SORT_OPTIONS: readonly ToolbarSelectOption<DashboardProductSort>[] = [
	{ value: "createdAt,desc", label: "Latest first" },
	{ value: "createdAt,asc", label: "Oldest first" },
	{ value: "name,asc", label: "Name (A–Z)" },
	{ value: "name,desc", label: "Name (Z–A)" },
	{ value: "price,asc", label: "Price: Low to High" },
	{ value: "price,desc", label: "Price: High to Low" },
];

type ProductFiltersToolbarProps = {
	filters: ProductFilters;
	sort: DashboardProductSort;
	categories: Category[];
	totalElements: number;
	isFilterActive: boolean;
	onFiltersChange: (next: Partial<ProductFilters>) => void;
	onSortChange: (sort: DashboardProductSort) => void;
	onResetFilters: () => void;
};

export const ProductFiltersToolbar = ({
	filters,
	sort,
	categories,
	totalElements,
	isFilterActive,
	onFiltersChange,
	onSortChange,
	onResetFilters,
}: ProductFiltersToolbarProps) => {
	const categoryOptions = useMemo<readonly ToolbarSelectOption<string>[]>(
		() => [
			{ value: "", label: "All Categories" },
			...categories.map((category) => ({
				value: category.id,
				label: category.label,
			})),
		],
		[categories],
	);

	// Remounting the search input on reset discards a draft that has not
	// committed yet, so it cannot re-apply itself right after the reset.
	const [resetKey, setResetKey] = useState(0);

	const handleReset = () => {
		setResetKey((key) => key + 1);
		onResetFilters();
	};

	return (
		<div className="flex flex-col gap-3 border-b border-brand-900/10 bg-surface-2/50 p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-1 flex-wrap items-center gap-2.5">
				<ToolbarSearchInput
					key={resetKey}
					value={filters.search}
					onCommit={(search) => onFiltersChange({ search })}
					placeholder="Search products..."
				/>

				<ToolbarSelect
					value={filters.categoryId}
					options={categoryOptions}
					onChange={(categoryId) => onFiltersChange({ categoryId })}
					ariaLabel="Filter by category"
				/>

				<ToolbarSelect
					value={sort}
					options={SORT_OPTIONS}
					onChange={onSortChange}
					ariaLabel="Sort products"
					className="min-w-37.5"
				/>

				{isFilterActive && <ResetFiltersButton onClick={handleReset} />}
			</div>

			<ResultsSummary
				totalElements={totalElements}
				itemLabel="product"
				className="pt-1 sm:pt-0"
			/>
		</div>
	);
};
