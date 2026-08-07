import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
	ChevronDownIcon,
	Search,
	SlidersHorizontalIcon,
	XIcon,
} from "lucide-react";
import type { Category } from "@/features/products/schemas/categorySchema";

type Filters = {
	search: string;
	categoryId: string;
};

type Sort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "name,asc"
	| "name,desc"
	| "price,asc"
	| "price,desc";
type Pagination = {
	page: number;
	sort: Sort;
	size: number;
};

// type ProductFiltersToolbarProps = {
// 	search?: string;
// 	selectedCategoryFilter?: string;
// 	sort: string;
// 	categories: CategoryOption[];
// 	totalElements: number;
// 	isFilterActive: boolean;
// 	onSearchChange: (value: string) => void;
// 	onCategoryFilterChange: (value: string) => void;
// 	onSortChange: (value: string) => void;
// 	onResetFilters: () => void;
// };
type ProductFiltersToolbarProps = {
	filters: Filters;
	pagination: Pagination;
	categories: Category[];
	totalElements: number;
	isFilterActive: boolean;
	updateFilters: (filters: Partial<Filters>) => void;
	updatePagination: (value: Partial<Pagination>) => void;
	onResetFilters: () => void;
};

export const ProductFiltersToolbar = ({
	categories,
	filters,
	pagination,
	totalElements,
	isFilterActive,
	updateFilters,
	updatePagination,
	onResetFilters,
}: ProductFiltersToolbarProps) => {
	const onSearchChange = (value: string) => updateFilters({ search: value });
	const onCategoryFilterChange = (categoryId: string) =>
		updateFilters({ categoryId });
	const onSortChange = (sort: Sort) => updatePagination({ sort });

	return (
		<div className="flex flex-col gap-3 rounded-t-xl border-b border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Search & Filter Controls Group */}
			<div className="flex flex-1 flex-wrap items-center gap-2.5">
				{/* Search Input with Clear Button */}
				<div className="relative min-w-50 flex-1 sm:max-w-xs">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={filters.search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Search products..."
						className="h-9.5 w-full rounded-lg border-slate-200 bg-slate-50/50 pl-9 pr-8 text-xs transition-colors placeholder:text-slate-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-emerald-600"
					/>
					{filters.search && (
						<button
							type="button"
							onClick={() => onSearchChange("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
						>
							<XIcon className="size-3.5" />
						</button>
					)}
				</div>

				{/* Category Filter Dropdown with Custom Arrow */}
				<div className="relative min-w-35">
					<select
						value={filters.categoryId}
						onChange={(e) => onCategoryFilterChange(e.target.value)}
						className="h-9.5 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 pl-3 pr-8 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
					>
						<option value="">All Categories</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.label}
							</option>
						))}
					</select>
					<ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
				</div>

				{/* Sort By Dropdown with Custom Arrow */}
				<div className="relative min-w-37.5">
					<select
						value={pagination.sort}
						onChange={(e) => onSortChange(e.target.value as Sort)}
						className="h-9.5 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 pl-3 pr-8 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
					>
						<option value="createdAt,desc">Latest first</option>
						<option value="createdAt,asc">Oldest first</option>
						<option value="name,asc">Name (A–Z)</option>
						<option value="name,desc">Name (Z–A)</option>
						<option value="price,asc">Price: Low to High</option>
						<option value="price,desc">Price: High to Low</option>
					</select>
					<ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
				</div>

				{/* Reset Filters Pill */}
				{isFilterActive && (
					<Button
						variant="ghost"
						onClick={onResetFilters}
						className="h-9.5 gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50/50 px-3 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100/60 hover:text-rose-700 active:scale-95"
					>
						<XIcon className="size-3.5" />
						Reset
					</Button>
				)}
			</div>

			{/* Results Counter Summary */}
			<div className="flex shrink-0 items-center justify-between pt-1 sm:pt-0">
				<span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
					<SlidersHorizontalIcon className="size-3.5 text-slate-400" />
					{totalElements === 0 ? (
						<span className="text-slate-400">No products found</span>
					) : (
						<span>
							<strong className="font-semibold text-slate-900">
								{totalElements}
							</strong>{" "}
							{totalElements === 1 ? "product" : "products"}
						</span>
					)}
				</span>
			</div>
		</div>
	);
};
