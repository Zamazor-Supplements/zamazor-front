import {
	Edit2Icon,
	FolderKanbanIcon,
	SearchIcon,
	Trash2Icon,
	XIcon,
} from "lucide-react";
import type { CategoryAnalytics } from "../schemas/dashboardSchema";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { useDeleteCategoryMutation } from "@/features/products/hooks/use-category";

interface ConfirmState {
	isOpen: boolean;
	title: string;
	description: string;
	confirmText: string;
	isDestructive: boolean;
	onConfirm: () => void | Promise<void>;
}

const initialConfirmState: ConfirmState = {
	isOpen: false,
	title: "",
	description: "",
	confirmText: "Continue",
	isDestructive: false,
	onConfirm: () => {},
};

export default function CategoryTable({
	analytics,
	pageSize = 8,
	refetch,
	openEdit,
}: {
	analytics: CategoryAnalytics;
	pageSize?: number;
	refetch: () => void;
	openEdit: (category: CategoryAnalytics[number]) => void;
}) {
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("label,asc");
	const [page, setPage] = useState(1);
	const [confirmState, setConfirmState] =
		useState<ConfirmState>(initialConfirmState);
	const deleteCategoryMutation = useDeleteCategoryMutation();

	const filteredCategories = useMemo(() => {
		if (!analytics) return [] satisfies CategoryAnalytics[];
		const normalizedSearch = search.trim().toLowerCase();

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
		analytics.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const endItemIndex = Math.min(safePage * pageSize, filteredCategories.length);

	const closeConfirm = () => setConfirmState(initialConfirmState);

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
				deleteCategoryMutation.mutate(category.id);
				refetch();
				closeConfirm();
			},
		});
	};

	const handleResetFilters = () => {
		setSearch("");
		setSortBy("label,asc");
		setPage(1);
	};

	return (
		<>
			<div className="overflow-hidden rounded-3xl border border-emerald-900/5 bg-white shadow-md">
				<div className="flex flex-col gap-3 border-b border-slate-100 bg-white p-4 xl:flex-row xl:items-center xl:justify-between">
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
								className="h-10 rounded-xl border-slate-200 bg-slate-50/40 pl-9 text-xs focus-visible:ring-emerald-800"
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

						{(search !== "" || sortBy !== "label,asc") && (
							<Button
								variant="outline"
								onClick={handleResetFilters}
								className="h-10 shrink-0 rounded-xl border border-dashed border-red-200 bg-red-50/25 px-3 text-xs font-semibold text-red-600 transition-all duration-150 hover:bg-red-50 hover:text-red-700"
							>
								Reset
								<XIcon className="ml-1.5 size-3.5" />
							</Button>
						)}
					</div>

					<div className="flex items-center gap-2">
						<div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-500">
							{analytics.length === 0
								? "No categories found"
								: `Showing ${startItemIndex}-${endItemIndex} of ${filteredCategories.length}`}
						</div>
						<div className="flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50/50 p-0.5 select-none">
							<Button
								variant="outline"
								size="icon"
								disabled={safePage === 1}
								onClick={() => setPage((current) => Math.max(1, current - 1))}
								className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
								title="Previous page"
							>
								&larr;
							</Button>
							<span className="min-w-13.75 px-1.5 text-center text-[10px] font-bold text-slate-500">
								{safePage} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="icon"
								disabled={safePage === totalPages}
								onClick={() =>
									setPage((current) => Math.min(totalPages, current + 1))
								}
								className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
								title="Next page"
							>
								&rarr;
							</Button>
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
								<th className="px-6 py-4">Category</th>
								<th className="px-6 py-4">ID</th>
								<th className="px-6 py-4">Linked Products</th>
								<th className="px-6 py-4">Usage</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{paginatedCategories.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-14 text-center text-slate-400"
									>
										No categories match the current filters.
									</td>
								</tr>
							) : (
								paginatedCategories.map((category) => {
									return (
										<tr key={category.id} className="hover:bg-slate-50/40">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-900/8">
														<FolderKanbanIcon className="size-4" />
													</div>
													<div>
														<p className="text-sm font-semibold text-slate-950">
															{category.label}
														</p>
														<p className="text-[11px] text-slate-500">
															{category.productCount > 0
																? "Used in catalog"
																: "Not used yet"}
														</p>
													</div>
												</div>
											</td>
											<td className="px-6 py-4">
												<Tooltip content={category.id}>
													<span className="cursor-help select-all font-mono text-[10px] font-bold text-slate-500">
														{category.id.slice(0, 8).toUpperCase()}
													</span>
												</Tooltip>
											</td>
											<td className="px-6 py-4">
												<span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
													{category.productCount} products
												</span>
											</td>
											<td className="px-6 py-4 text-xs text-slate-500">
												{category.productCount > 0
													? `Category appears in ${category.productCount} product${category.productCount > 1 ? "s" : ""}.`
													: "Ready to assign in the product form."}
											</td>
											<td className="px-6 py-4 text-right">
												<div className="flex items-center justify-end gap-2">
													<Button
														variant="outline"
														size="icon"
														onClick={() => openEdit(category)}
														className="h-8 w-8 rounded-lg border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
														title="Edit category"
													>
														<Edit2Icon className="size-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleDelete(category)}
														className="h-8 w-8 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50"
														title="Delete category"
													>
														<Trash2Icon className="size-4" />
													</Button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
			<ConfirmDialog
				isOpen={confirmState.isOpen}
				title={confirmState.title}
				description={confirmState.description}
				confirmText={confirmState.confirmText}
				isDestructive={confirmState.isDestructive}
				onConfirm={confirmState.onConfirm}
				onClose={closeConfirm}
			/>
		</>
	);
}
