import { useState } from "react";
import { motion } from "framer-motion";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/core/config/constants";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FolderKanban, Plus, RefreshCw, X } from "lucide-react";
import type { CategoryAnalytics } from "@/features/dashboard/schemas/dashboardSchema";
import CategoryTable from "@/features/dashboard/components/CategoryTable";
import { useDashboardCategories } from "@/features/dashboard/hooks/use-dashboard";
import {
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
} from "@/features/products/hooks/use-category";

const cardMotion = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.35 },
};

const formatCount = (value: number) =>
	new Intl.NumberFormat("en", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value);

export const CategoriesPage = () => {
	useDocumentTitle(`Categories Management | ${CONFIG.APP_NAME}`);

	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		CategoryAnalytics[number] | null
	>(null);
	const [categoryName, setCategoryName] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [nameError, setNameError] = useState("");
	const {
		data: categoryAnalytics,
		isPending,
		refetch,
	} = useDashboardCategories();

	const createCategoryMutation = useCreateCategoryMutation();
	const updateCategoryMutation = useUpdateCategoryMutation();

	const openCreate = () => {
		setEditingCategory(null);
		setCategoryName("");
		setNameError("");
		setCreateOpen(true);
	};

	const openEdit = (category: CategoryAnalytics[number]) => {
		setEditingCategory(category);
		setCategoryName(category.label);
		setNameError("");
		setEditOpen(true);
	};

	const resetForm = () => {
		setCategoryName("");
		setNameError("");
		setEditingCategory(null);
	};

	const saveCategory = async () => {
		setSubmitting(true);
		const nextLabel = categoryName.trim();
		try {
			if (editingCategory)
				await updateCategoryMutation.mutateAsync({
					id: editingCategory.id,
					label: nextLabel,
				});
			else await createCategoryMutation.mutateAsync(nextLabel);

			setCreateOpen(false);
			setEditOpen(false);
			resetForm();
			setNameError("");
			await refetch();
		} finally {
			setSubmitting(false);
		}
	};

	if (isPending || !categoryAnalytics) {
		return (
			<div className="flex min-h-105 flex-col items-center justify-center gap-3">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-950" />
				<p className="text-xs font-semibold text-slate-500">
					Loading categories...
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">
						Categories
					</p>
					<h2 className="text-2xl font-playfair text-slate-950 sm:text-3xl">
						Category list
					</h2>
					<p className="max-w-2xl text-sm text-slate-500">
						Manage catalog groupings and keep product navigation clean.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={() => refetch()}
						className="h-10 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold"
					>
						<RefreshCw className="mr-1.5 size-4" />
						Refresh
					</Button>
					<Button
						onClick={openCreate}
						className="h-10 rounded-xl bg-emerald-900 px-4 text-xs font-semibold text-white hover:bg-emerald-950"
					>
						<Plus className="mr-1.5 size-4" />
						New Category
					</Button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					{
						label: "Total Categories",
						value: formatCount(categoryAnalytics.length),
						icon: FolderKanban,
						accent: "bg-emerald-50 text-emerald-800",
					},
				].map((metric, index) => {
					const Icon = metric.icon;
					return (
						<motion.div
							key={metric.label}
							{...cardMotion}
							transition={{ duration: 0.35, delay: index * 0.05 }}
							className="relative overflow-hidden rounded-3xl border border-white bg-white p-5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)]"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
										{metric.label}
									</p>
									<h3 className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950">
										{metric.value}
									</h3>
									<p className="mt-1 text-xs text-slate-500">
										Across the catalog
									</p>
								</div>
								<div
									className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ${metric.accent}`}
								>
									<Icon className="size-5" />
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<CategoryTable
				analytics={categoryAnalytics}
				refetch={refetch}
				openEdit={openEdit}
			/>

			{(createOpen || editOpen) && (
				<div className="fixed inset-0 z-999 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
					<div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
						<button
							onClick={() => {
								setCreateOpen(false);
								setEditOpen(false);
								resetForm();
							}}
							className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
						>
							<X className="size-4" />
						</button>

						<h3 className="mb-2 font-sans text-xl font-semibold text-slate-950">
							{editingCategory ? "Edit Category" : "New Category"}
						</h3>
						<p className="mb-6 text-sm text-slate-500">
							{editingCategory
								? "Rename the category used in the catalog and product forms."
								: "Create a new category group for products and storefront filters."}
						</p>

						<div className="space-y-2">
							<label className="text-xs font-bold uppercase tracking-wider text-slate-400">
								Category Label
							</label>
							<Input
								value={categoryName}
								onChange={(e) => {
									setCategoryName(e.target.value);
									if (nameError) setNameError("");
								}}
								placeholder="e.g. Recovery"
								className={`h-11 rounded-xl border-slate-200 bg-slate-50/40 focus-visible:ring-emerald-800 ${
									nameError ? "border-red-500 focus-visible:ring-red-500" : ""
								}`}
							/>
							{nameError && (
								<p className="text-xs font-semibold text-red-600">
									{nameError}
								</p>
							)}
						</div>

						<div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
							<Button
								variant="outline"
								onClick={() => {
									setCreateOpen(false);
									setEditOpen(false);
									resetForm();
								}}
								className="h-10 rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-600"
							>
								Cancel
							</Button>
							<Button
								onClick={() => saveCategory()}
								disabled={submitting}
								className="h-10 rounded-xl bg-emerald-900 px-5 text-xs font-bold text-white hover:bg-emerald-950"
							>
								{submitting
									? "Saving..."
									: editingCategory
										? "Save Changes"
										: "Create Category"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* <ConfirmDialog
				isOpen={confirmOpen}
				title={confirmTitle}
				description={confirmDesc}
				confirmText={confirmText}
				isDestructive={confirmDestructive}
				onConfirm={confirmAction || (() => {})}
				onClose={() => setConfirmOpen(false)}
			/> */}
		</div>
	);
};
