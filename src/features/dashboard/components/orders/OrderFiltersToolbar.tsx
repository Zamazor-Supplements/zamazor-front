import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	SearchIcon,
	XIcon,
} from "lucide-react";
import {
	ORDER_STATUS_META,
	OrderStatus,
} from "@/features/orders/constants/orderStatus";

type Filters = {
	search: string | undefined;
	status: OrderStatus | undefined;
};

type Sort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "total,desc"
	| "total,asc"
	| "status,asc";
type Pagination = {
	page: number;
	size: number;
	sort: Sort;
};

interface OrderFiltersToolbarProps {
	filters: Filters;
	isFilterActive: boolean;
	pagination: Pagination;
	totalElements: number;
	totalPages: number;
	updateFilters: (value: Partial<Filters>) => void;
	updatePagination: (value: Partial<Pagination>) => void;
	onResetFilters: () => void;
}

export const OrderFiltersToolbar = ({
	filters,
	isFilterActive,
	pagination,
	totalElements,
	totalPages,
	updateFilters,
	updatePagination,
	onResetFilters,
}: OrderFiltersToolbarProps) => {
	const currentPage = pagination.page;
	const start = totalElements === 0 ? 0 : currentPage * pagination.size + 1;
	const end = Math.min((currentPage + 1) * pagination.size, totalElements);

	const onSearchChange = (value: string) => updateFilters({ search: value });
	const onSortChange = (value: Sort) => updatePagination({ sort: value });
	const onStatusChange = (value: OrderStatus) =>
		updateFilters({ status: value });

	const nextPage = () =>
		updatePagination({ page: Math.min(totalPages - 1, currentPage + 1) });

	// Fixed logic: using Math.max to prevent negative indexes
	const previousPage = () =>
		updatePagination({ page: Math.max(0, currentPage - 1) });

	return (
		<div className="border-b border-slate-200/80 bg-slate-50/50 p-4">
			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				{/* Left Section: SearchIcon & Select Inputs */}
				<div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center max-w-3xl">
					{/* SearchIcon Input */}
					<div className="relative flex-1 min-w-0">
						<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={filters.search}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder="SearchIcon order ID, address, item..."
							className="h-10 rounded-xl border-slate-200 bg-white pl-9 text-xs focus-visible:ring-emerald-800"
						/>
					</div>

					{/* Status Filter */}
					<select
						value={filters.status}
						onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
						className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
					>
						<option value="">All Statuses</option>
						{Object.entries(ORDER_STATUS_META).map(([key, meta]) => (
							<option key={key} value={key}>
								{meta.label}
							</option>
						))}
					</select>

					{/* Sort Selector */}
					<select
						value={pagination.sort}
						onChange={(e) => onSortChange(e.target.value as Sort)}
						className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
					>
						<option value="createdAt,desc">Newest first</option>
						<option value="createdAt,asc">Oldest first</option>
						<option value="total,desc">Highest total</option>
						<option value="total,asc">Lowest total</option>
						<option value="status,asc">Status</option>
					</select>

					{/* Reset Button */}
					{isFilterActive && (
						<Button
							variant="outline"
							onClick={onResetFilters}
							className="h-10 shrink-0 rounded-xl border border-dashed border-rose-200 bg-rose-50/30 px-3 text-xs font-semibold text-rose-600 transition-all duration-150 hover:bg-rose-50 hover:text-rose-700"
						>
							Reset
							<XIcon className="ml-1.5 size-3.5" />
						</Button>
					)}
				</div>

				{/* Right Section: Pagination Summary & Quick Controls */}
				<div className="flex items-center gap-2">
					<div className="rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
						{totalElements === 0 ? (
							"No orders"
						) : (
							<>
								Showing{" "}
								<span className="font-bold text-slate-900">{start}</span>–
								<span className="font-bold text-slate-900">{end}</span> of{" "}
								<span className="font-bold text-slate-900">
									{totalElements}
								</span>
							</>
						)}
					</div>

					{totalPages > 1 && (
						<div className="flex items-center gap-1 rounded-xl border border-slate-200/60 bg-white p-1 select-none">
							<Button
								variant="outline"
								size="icon"
								disabled={currentPage === 0}
								onClick={previousPage}
								className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
								title="Previous page"
							>
								<ChevronLeftIcon className="size-4" />
							</Button>

							<span className="min-w-16 px-1.5 text-center text-xs font-semibold text-slate-700">
								{currentPage + 1} / {totalPages}
							</span>

							<Button
								variant="outline"
								size="icon"
								disabled={currentPage >= totalPages - 1}
								onClick={nextPage}
								className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
								title="Next page"
							>
								<ChevronRightIcon className="size-4" />
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
