import {
	ChevronLeftIcon,
	ChevronRightIcon,
	Edit2Icon,
	FolderKanbanIcon,
	FolderXIcon,
	SearchIcon,
	Trash2Icon,
	XIcon,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { useDeleteCategory } from "@/features/products/services/category/mutations";
import type { CategoryAnalytics } from "../../schemas/dashboardSchema";

interface ConfirmState {
	isOpen: boolean;
	title: string;
	description: string;
	confirmText: string;
	isDestructive: boolean;
	onConfirm: () => void | Promise<void>;
}

const INITIAL_CONFIRM_STATE: ConfirmState = {
	isOpen: false,
	title: "",
	description: "",
	confirmText: "Continue",
	isDestructive: false,
	onConfirm: () => {},
};

interface CategoryTableProps {
	analytics: CategoryAnalytics;
	pageSize?: number;
	isFetching?: boolean;
	refetch: () => void;
	openEdit: (category: CategoryAnalytics[number]) => void;
}

export default function CategoryTable({
	analytics,
	pageSize = 8,
	isFetching = false,
	refetch,
	openEdit,
}: CategoryTableProps) {
	const [search, setSearch] = useState<string | undefined>(undefined);
	const [sortBy, setSortBy] = useState("label,asc");
	const [page, setPage] = useState(1);
	const [confirmState, setConfirmState] = useState<ConfirmState>(
		INITIAL_CONFIRM_STATE,
	);

	const deleteCategoryMutation = useDeleteCategory();

	const filteredCategories = useMemo(() => {
		if (!analytics) return [] satisfies CategoryAnalytics[];
		const normalizedSearch = search?.trim().toLowerCase();

		const filtered = analytics.filter((category) => {
			if (!normalizedSearch) return true;
			return (
				category.id.toLowerCase().includes(normalizedSearch) ||
				category.label.toLowerCase().includes(normalizedSearch)
			);
		});

		return filtered.sort((a, b) => {
			switch (sortBy) {
				case "label,desc":
					return b.label.localeCompare(a.label);
				case "products,desc":
					return (b.productCount || 0) - (a.productCount || 0);
				case "products,asc":
					return (a.productCount || 0) - (b.productCount || 0);
				default:
					return a.label.localeCompare(b.label);
			}
		});
	}, [analytics, search, sortBy]);

	const totalPages = Math.max(
		1,
		Math.ceil(filteredCategories.length / pageSize),
	);
	const safePage = Math.min(page, totalPages);

	const paginatedCategories = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return filteredCategories.slice(start, start + pageSize);
	}, [filteredCategories, pageSize, safePage]);

	const startItemIndex =
		filteredCategories.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const endItemIndex = Math.min(safePage * pageSize, filteredCategories.length);

	const closeConfirm = () => setConfirmState(INITIAL_CONFIRM_STATE);

	const handleDelete = (category: CategoryAnalytics[number]) => {
		const isLinked = category.productCount > 0;

		setConfirmState({
			isOpen: true,
			title: "Delete Category",
			description: isLinked
				? `Delete "${category.label}"? This category is currently linked to ${category.productCount} product(s).`
				: `Delete "${category.label}"? This action cannot be undone.`,
			confirmText: "Delete",
			isDestructive: true,
			onConfirm: async () => {
				await deleteCategoryMutation.mutateAsync(category.id);
				refetch();
				closeConfirm();
			},
		});
	};

	const handleResetFilters = () => {
		setSearch(undefined);
		setSortBy("label,asc");
		setPage(1);
	};

	return (
		<>
			<div className="relative flex flex-col border border-slate-200/80 bg-white shadow-sm overflow-hidden rounded-3xl">
				{/* Subtle Top Loader Bar during background refetching */}
				{isFetching && (
					<div className="absolute top-0 left-0 right-0 h-1 bg-emerald-100 overflow-hidden z-20">
						<div className="h-full bg-emerald-600 animate-pulse w-full" />
					</div>
				)}

				{/* Filter Toolbar */}
				<div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/50 p-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center max-w-3xl">
						<div className="relative flex-1 min-w-0">
							<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
							<Input
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								placeholder="Search categories..."
								className="h-10 rounded-xl border-slate-200 bg-white pl-9 text-xs focus-visible:ring-emerald-800"
							/>
						</div>

						<select
							value={sortBy}
							onChange={(e) => {
								setSortBy(e.target.value);
								setPage(1);
							}}
							className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
						>
							<option value="label,asc">Label A-Z</option>
							<option value="label,desc">Label Z-A</option>
							<option value="products,desc">Most products</option>
							<option value="products,asc">Least products</option>
						</select>

						{(search || sortBy !== "label,asc") && (
							<Button
								variant="outline"
								onClick={handleResetFilters}
								className="h-10 shrink-0 rounded-xl border border-dashed border-rose-200 bg-rose-50/30 px-3 text-xs font-semibold text-rose-600 transition-all duration-150 hover:bg-rose-50 hover:text-rose-700"
							>
								Reset
								<XIcon className="ml-1.5 size-3.5" />
							</Button>
						)}
					</div>
				</div>

				{/* Table Area */}
				<div
					className={`min-h-96 overflow-x-auto transition-opacity duration-200 ${
						isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
					}`}
				>
					<table className="w-full border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
								<th className="px-6 py-3.5">Category</th>
								<th className="px-6 py-3.5">ID</th>
								<th className="px-6 py-3.5">Linked Products</th>
								<th className="px-6 py-3.5">Usage Status</th>
								<th className="px-6 py-3.5 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{paginatedCategories.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-16 text-center">
										<div className="mx-auto flex max-w-xs flex-col items-center gap-2">
											<div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
												<FolderXIcon className="size-6" />
											</div>
											<p className="text-sm font-medium text-slate-900">
												No categories found
											</p>
											<p className="text-xs text-slate-500">
												No categories matched your current search filters.
											</p>
										</div>
									</td>
								</tr>
							) : (
								paginatedCategories.map((category) => (
									<tr
										key={category.id}
										className="group transition-colors duration-150 hover:bg-slate-50/60"
									>
										{/* Category Label */}
										<td className="px-6 py-3.5 max-w-md">
											<div className="flex items-center gap-3.5">
												<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200/60 bg-emerald-50/50 text-emerald-800">
													<FolderKanbanIcon className="size-5" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="truncate text-xs font-semibold text-slate-900">
														{category.label}
													</p>
													<p className="truncate text-[11px] text-slate-500 mt-0.5">
														{category.productCount > 0
															? "Used in store catalog"
															: "Not linked to any product"}
													</p>
												</div>
											</div>
										</td>

										{/* Category ID */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<Tooltip content={`ID: ${category.id}`}>
												<span className="shrink-0 cursor-help rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 select-all border border-slate-200/50">
													#{category.id.slice(0, 8)}
												</span>
											</Tooltip>
										</td>

										{/* Products Count Badge */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<span className="inline-flex items-center rounded-md border border-slate-200/60 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700">
												{category.productCount} products
											</span>
										</td>

										{/* Usage Status */}
										<td className="px-6 py-3.5 text-xs text-slate-500 whitespace-nowrap">
											<span
												className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
													category.productCount > 0
														? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
														: "bg-amber-50 text-amber-700 border border-amber-200/60"
												}`}
											>
												<span
													className={`size-1.5 rounded-full ${
														category.productCount > 0
															? "bg-emerald-500"
															: "bg-amber-500"
													}`}
												/>
												{category.productCount > 0 ? "Active" : "Unused"}
											</span>
										</td>

										{/* Actions */}
										<td className="px-6 py-3.5 text-right whitespace-nowrap">
											<div className="flex items-center justify-end gap-1">
												<Tooltip content="Edit Category">
													<button
														onClick={() => openEdit(category)}
														className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95"
													>
														<Edit2Icon className="size-4" />
													</button>
												</Tooltip>
												<Tooltip content="Delete Category">
													<button
														onClick={() => handleDelete(category)}
														className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
													>
														<Trash2Icon className="size-4" />
													</button>
												</Tooltip>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination Controls */}
				{filteredCategories.length > 0 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50/50 px-6 py-3 select-none">
						<p className="text-xs text-slate-500 font-medium">
							Showing{" "}
							<span className="font-semibold text-slate-900">
								{startItemIndex}
							</span>
							–
							<span className="font-semibold text-slate-900">
								{endItemIndex}
							</span>{" "}
							of{" "}
							<span className="font-semibold text-slate-900">
								{filteredCategories.length}
							</span>{" "}
							categories
						</p>

						{totalPages > 1 && (
							<div className="flex items-center gap-1.5">
								<Button
									variant="outline"
									size="icon"
									disabled={safePage === 1 || isFetching}
									onClick={() => setPage((c) => Math.max(1, c - 1))}
									className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
								>
									<ChevronLeftIcon className="size-4" />
								</Button>

								<div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-700">
									Page {safePage} of {totalPages}
								</div>

								<Button
									variant="outline"
									size="icon"
									disabled={safePage >= totalPages || isFetching}
									onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
									className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
								>
									<ChevronRightIcon className="size-4" />
								</Button>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Confirmation Dialog with fixed isLoading prop */}
			<ConfirmDialog
				isOpen={confirmState.isOpen}
				title={confirmState.title}
				description={confirmState.description}
				confirmText={confirmState.confirmText}
				isDestructive={confirmState.isDestructive}
				isLoading={deleteCategoryMutation.isPending}
				onConfirm={confirmState.onConfirm}
				onClose={closeConfirm}
			/>
		</>
	);
}
