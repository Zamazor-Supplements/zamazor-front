import {
	useMemo,
	type ChangeEvent,
	type Dispatch,
	type SetStateAction,
} from "react";
import {
	ITEMS_PER_PAGE,
	type Paginations,
	type Sort,
} from "../../types/filters";
import { ArrowUpDownIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { MiniPaginationNav } from "./MinPaginationNav";

interface SortOptionConfig {
	value: Sort;
	label: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
	{ value: "createdAt,desc", label: "Newest first" },
	{ value: "createdAt,asc", label: "Oldest first" },
	{ value: "name,asc", label: "Name A-Z" },
	{ value: "name,desc", label: "Name Z-A" },
	{ value: "price,asc", label: "Price low to high" },
	{ value: "price,desc", label: "Price high to low" },
];

interface PaginationHeaderProps {
	paginations: Paginations;
	setPaginations: Dispatch<SetStateAction<Paginations>>;
	totalPages: number;
	totalItems: number;
	setIsMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

export const PaginationHeader = ({
	paginations,
	setPaginations,
	totalPages,
	totalItems,
	setIsMobileFiltersOpen,
}: PaginationHeaderProps) => {
	const countMessage = useMemo(() => {
		if (totalItems <= 0) return "Showing 0 clean formulas";

		const pageSize = paginations.size ?? ITEMS_PER_PAGE;
		const start = paginations.page * pageSize + 1;
		const end = Math.min((paginations.page + 1) * pageSize, totalItems);

		return `Showing ${start}–${end} of ${totalItems} clean formulas`;
	}, [paginations.page, paginations.size, totalItems]);

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const newSort = e.target.value as Sort;
		setPaginations((prev) => ({
			...prev,
			sort: newSort,
			page: 0,
		}));
	};

	return (
		<div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
			{/* Left Column: Mobile Filter Toggle & Item Count */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => setIsMobileFiltersOpen(true)}
					aria-label="Open filters menu"
					className="flex h-10 items-center gap-1.5 rounded-xl border-emerald-900/10 px-4 font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 lg:hidden"
				>
					<SlidersHorizontalIcon className="size-4" aria-hidden="true" />
					<span>Filters</span>
				</Button>

				<span className="text-xs font-bold text-slate-500 font-sans">
					{countMessage}
				</span>
			</div>

			{/* Right Column: Mini Navigation & Sort Selector */}
			<div className="flex items-center gap-3">
				{/* Mini Pagination Controls */}
				<MiniPaginationNav
					paginations={paginations}
					setPaginations={setPaginations}
					totalPages={totalPages}
				/>

				{/* Sort Selector */}
				<div className="flex items-center gap-2">
					<ArrowUpDownIcon
						className="size-4 text-slate-400"
						aria-hidden="true"
					/>
					<select
						value={paginations.sort}
						onChange={handleSortChange}
						aria-label="Sort products by"
						className="h-10 cursor-pointer rounded-xl border border-emerald-900/10 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20"
					>
						{SORT_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};
