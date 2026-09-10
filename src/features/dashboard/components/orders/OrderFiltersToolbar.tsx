import { useState } from "react";
import {
	ORDER_STATUS_META,
	type OrderStatus,
	type OrderStatusFilter,
} from "@/features/orders/constants/orderStatus";
import type { OrderSort } from "../../hooks/use-dashboard-order-filters";
import { ResetFiltersButton } from "../shared/ResetFiltersButton";
import { ResultsSummary } from "../shared/ResultsSummary";
import { ToolbarSearchInput } from "../shared/ToolbarSearchInput";
import {
	ToolbarSelect,
	type ToolbarSelectOption,
} from "../shared/ToolbarSelect";

export type OrderFilters = {
	search: string | undefined;
	status: OrderStatusFilter;
};

const SORT_OPTIONS: readonly ToolbarSelectOption<OrderSort>[] = [
	{ value: "createdAt,desc", label: "Newest first" },
	{ value: "createdAt,asc", label: "Oldest first" },
	{ value: "total,desc", label: "Highest total" },
	{ value: "total,asc", label: "Lowest total" },
	{ value: "status,asc", label: "Status" },
];

const STATUS_OPTIONS: readonly ToolbarSelectOption<OrderStatus | "">[] = [
	{ value: "", label: "All Statuses" },
	...(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((status) => ({
		value: status,
		label: ORDER_STATUS_META[status].label,
	})),
];

interface OrderFiltersToolbarProps {
	filters: OrderFilters;
	sort: OrderSort;
	totalElements: number;
	isFilterActive: boolean;
	onFiltersChange: (next: Partial<OrderFilters>) => void;
	onSortChange: (sort: OrderSort) => void;
	onResetFilters: () => void;
}

export const OrderFiltersToolbar = ({
	filters,
	sort,
	totalElements,
	isFilterActive,
	onFiltersChange,
	onSortChange,
	onResetFilters,
}: OrderFiltersToolbarProps) => {
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
					placeholder="Search by customer name..."
				/>

				<ToolbarSelect
					value={filters.status ?? ""}
					options={STATUS_OPTIONS}
					onChange={(status) =>
						onFiltersChange({ status: status || undefined })
					}
					ariaLabel="Filter by status"
				/>

				<ToolbarSelect
					value={sort}
					options={SORT_OPTIONS}
					onChange={onSortChange}
					ariaLabel="Sort orders"
					className="min-w-37.5"
				/>

				{isFilterActive && <ResetFiltersButton onClick={handleReset} />}
			</div>

			<ResultsSummary
				totalElements={totalElements}
				itemLabel="order"
				className="pt-1 sm:pt-0"
			/>
		</div>
	);
};
