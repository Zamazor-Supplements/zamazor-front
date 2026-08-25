import type { LucideIcon } from "lucide-react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	InboxIcon,
	SearchIcon,
	XIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
	header: string;
	align?: "left" | "right";
	/** Extra classes for the <th>. */
	className?: string;
	render: (row: T) => ReactNode;
}

export interface SortOption {
	value: string;
	label: string;
}

interface DataTableProps<T> {
	columns: DataTableColumn<T>[];
	rows: T[];
	rowKey: (row: T) => string;
	/** Plural label used in the pagination footer, e.g. "categories". */
	itemLabel: string;
	searchPlaceholder?: string;
	/** Own the search state here; tables supply their matching logic. */
	filterFn?: (rows: T[], search: string) => T[];
	sortOptions?: SortOption[];
	defaultSort?: string;
	sortFn?: (rows: T[], sortBy: string) => T[];
	pageSize?: number;
	loading?: boolean;
	emptyIcon?: LucideIcon;
	emptyTitle?: string;
	emptyDescription?: string;
	/** e.g. a "Reset filters" button. */
	toolbarActions?: ReactNode;
}

/**
 * Shared dashboard table shell: toolbar (search + sort + actions), table with
 * column-config rows, pagination footer, loading bar and empty state.
 */
export function DataTable<T>({
	columns,
	rows,
	rowKey,
	itemLabel,
	searchPlaceholder = "Search...",
	filterFn,
	sortOptions,
	defaultSort = "",
	sortFn,
	pageSize = 8,
	loading = false,
	emptyIcon: EmptyIcon = InboxIcon,
	emptyTitle = "Nothing here yet",
	emptyDescription,
	toolbarActions,
}: DataTableProps<T>) {
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState(defaultSort);
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		let next = rows;
		if (filterFn && search.trim()) {
			next = filterFn(next, search.trim());
		}
		if (sortFn && sortBy) {
			next = sortFn(next, sortBy);
		}
		return next;
	}, [rows, filterFn, search, sortFn, sortBy]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const safePage = Math.min(page, totalPages);

	const visibleRows = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return filtered.slice(start, start + pageSize);
	}, [filtered, pageSize, safePage]);

	const startIndex = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const endIndex = Math.min(safePage * pageSize, filtered.length);

	const isFiltered = Boolean(search || (sortOptions && sortBy !== defaultSort));

	const handleReset = () => {
		setSearch("");
		setSortBy(defaultSort);
		setPage(1);
	};

	return (
		<div className="relative flex flex-col overflow-hidden rounded-lg border border-brand-900/10 bg-card shadow-sm">
			{/* Subtle top loader bar during background refetching */}
			{loading && (
				<div className="absolute left-0 right-0 top-0 z-20 h-1 overflow-hidden bg-brand-100">
					<div className="h-full w-full animate-pulse bg-brand-600" />
				</div>
			)}

			{/* Toolbar */}
			{(searchPlaceholder || sortOptions || toolbarActions) && (
				<div className="flex flex-col gap-3 border-b border-brand-900/10 bg-surface-2/50 p-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex max-w-3xl flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
						<div className="relative min-w-0 flex-1">
							<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
							<Input
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								placeholder={searchPlaceholder}
								className="h-10 rounded-lg border-brand-900/10 bg-card pl-9 text-xs focus-visible:ring-brand-800"
							/>
						</div>

						{sortOptions && (
							<select
								value={sortBy}
								onChange={(e) => {
									setSortBy(e.target.value);
									setPage(1);
								}}
								className="h-10 rounded-lg border border-brand-900/10 bg-card px-3 text-xs font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-800"
							>
								{sortOptions.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						)}

						{isFiltered && (
							<Button
								variant="outline"
								onClick={handleReset}
								className="h-10 shrink-0 rounded-lg border border-dashed border-rose-200 bg-rose-50/30 px-3 text-xs font-semibold text-rose-600 transition-all duration-150 hover:bg-rose-50 hover:text-rose-700"
							>
								Reset
								<XIcon className="ml-1.5 size-3.5" />
							</Button>
						)}
					</div>

					{toolbarActions}
				</div>
			)}

			{/* Table */}
			<div
				className={cn(
					"min-h-96 overflow-x-auto transition-opacity duration-200",
					loading && "pointer-events-none opacity-60",
				)}
			>
				<table className="w-full border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-brand-900/10 bg-surface-2/80 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
							{columns.map((col) => (
								<th
									key={col.header}
									className={cn(
										"px-6 py-3.5",
										col.align === "right" && "text-right",
										col.className,
									)}
								>
									{col.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-brand-900/10">
						{visibleRows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-6 py-16 text-center"
								>
									<div className="mx-auto flex max-w-xs flex-col items-center gap-2">
										<div className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
											<EmptyIcon className="size-6" />
										</div>
										<p className="text-sm font-medium text-ink">
											{emptyTitle}
										</p>
										{emptyDescription && (
											<p className="text-xs text-ink-soft">
												{emptyDescription}
											</p>
										)}
									</div>
								</td>
							</tr>
						) : (
							visibleRows.map((row) => (
								<tr
									key={rowKey(row)}
									className="transition-colors duration-150 hover:bg-surface-2/60"
								>
									{columns.map((col) => (
										<td
											key={col.header}
											className={cn(
												"px-6 py-3.5",
												col.align === "right" && "text-right",
											)}
										>
											{col.render(row)}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{filtered.length > 0 && (
				<div className="flex flex-col items-center justify-between gap-3 border-t border-brand-900/10 bg-surface-2/50 px-6 py-3 select-none sm:flex-row">
					<p className="text-xs font-medium text-ink-soft">
						Showing{" "}
						<span className="font-semibold text-ink">{startIndex}</span>
						–<span className="font-semibold text-ink">{endIndex}</span>{" "}
						of{" "}
						<span className="font-semibold text-ink">
							{filtered.length}
						</span>{" "}
						{itemLabel}
					</p>

					{totalPages > 1 && (
						<div className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="icon"
								disabled={safePage === 1 || loading}
								onClick={() => setPage((c) => Math.max(1, c - 1))}
								className="h-8 w-8 rounded-lg border-brand-900/10 text-ink-soft hover:bg-surface-2 disabled:opacity-40"
							>
								<ChevronLeftIcon className="size-4" />
							</Button>

							<div className="flex items-center gap-1 px-2 text-xs font-semibold text-ink">
								Page {safePage} of {totalPages}
							</div>

							<Button
								variant="outline"
								size="icon"
								disabled={safePage >= totalPages || loading}
								onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
								className="h-8 w-8 rounded-lg border-brand-900/10 text-ink-soft hover:bg-surface-2 disabled:opacity-40"
							>
								<ChevronRightIcon className="size-4" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
