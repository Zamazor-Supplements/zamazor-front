import { useCallback, useEffect, useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	AlertCircleIcon,
	FolderKanban,
	Loader2Icon,
	Plus,
	RefreshCw,
	X,
} from "lucide-react";
import type { CategoryAnalytics } from "@/features/dashboard/schemas/dashboardSchema";
import { useDashboardCategories } from "@/features/dashboard/services/queries";
import {
	useCreateCategory,
	useUpdateCategory,
} from "@/features/products/services/category/mutations";
import { isSystemError } from "@/shared/types";
import CategoryTable from "@/features/dashboard/components/categories/CategoryTable";
import { MetricCard } from "../components/shared/MetricCard";

export const CategoriesPage = () => {
	useDocumentTitle(`Categories Management | ${CONFIG.APP_NAME}`);

	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		CategoryAnalytics[number] | null
	>(null);
	const [categoryName, setCategoryName] = useState("");
	const [nameError, setNameError] = useState("");

	const {
		data: categoryAnalytics,
		isPending,
		isFetching,
		refetch,
	} = useDashboardCategories();

	const createCategoryMutation = useCreateCategory();
	const updateCategoryMutation = useUpdateCategory();

	const isSubmitting =
		createCategoryMutation.isPending || updateCategoryMutation.isPending;

	const resetForm = useCallback(() => {
		setCategoryName("");
		setNameError("");
		setEditingCategory(null);
	}, []);

	const closeModal = useCallback(() => {
		setCreateOpen(false);
		setEditOpen(false);
		resetForm();
	}, [resetForm]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && (createOpen || editOpen)) {
				closeModal();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [createOpen, editOpen, closeModal]);

	const openCreate = () => {
		resetForm();
		setCreateOpen(true);
	};

	const openEdit = (category: CategoryAnalytics[number]) => {
		setEditingCategory(category);
		setCategoryName(category.label);
		setNameError("");
		setEditOpen(true);
	};

	const handleSave = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmed = categoryName.trim();
		if (!trimmed) {
			setNameError("Category name cannot be empty.");
			return;
		}

		try {
			if (editingCategory) {
				await updateCategoryMutation.mutateAsync({
					id: editingCategory.id,
					label: trimmed,
				});
			} else {
				await createCategoryMutation.mutateAsync(trimmed);
			}

			closeModal();
			await refetch();
		} catch (err: unknown) {
			if (isSystemError(err))
				setNameError(err?.description || "Failed to save category. Try again.");
		}
	};

	if (isPending || !categoryAnalytics) {
		return (
			<div className="space-y-6 animate-pulse">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<div className="h-3 w-28 rounded-md bg-slate-200" />
						<div className="h-8 w-56 rounded-lg bg-slate-200" />
						<div className="h-4 w-80 rounded-md bg-slate-200" />
					</div>
					<div className="flex items-center gap-2">
						<div className="h-10 w-24 rounded-xl bg-slate-200" />
						<div className="h-10 w-36 rounded-xl bg-slate-200" />
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div className="h-28 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-5" />
				</div>

				<div className="h-96 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-6" />
			</div>
		);
	}

	const isModalVisible = createOpen || editOpen;

	const metric = {
		label: "Total Categories",
		value: String(categoryAnalytics.length),
		subtitle: "Active in catalog navigation",
		icon: FolderKanban,
		accent: "bg-emerald-50 text-emerald-800 border-emerald-100",
		alert: false,
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="space-y-1">
					<p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800">
						Catalog Settings
					</p>
					<h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
						Categories Management
					</h2>
					<p className="max-w-2xl text-xs sm:text-sm text-slate-500">
						Manage catalog groupings and keep storefront navigation structured.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						onClick={() => refetch()}
						disabled={isFetching}
						className="h-10 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						<RefreshCw
							className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin text-emerald-800" : ""}`}
						/>
						Refresh
					</Button>

					<Button
						onClick={openCreate}
						className="h-10 rounded-xl bg-emerald-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-950 shadow-xs"
					>
						<Plus className="mr-1.5 size-4" />
						New Category
					</Button>
				</div>
			</div>

			{/* Metric Cards */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{/* <motion.div
					{...cardMotion}
					className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs"
				>
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0">
							<p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
								Total Categories
							</p>
							<h3 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
								{categoryAnalytics.length}
							</h3>
							<p className="mt-1 text-[11px] font-medium text-slate-500">
								Active in catalog navigation
							</p>
						</div>
						<div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
							<FolderKanban className="size-5" />
						</div>
					</div>
				</motion.div> */}

				<MetricCard metric={metric} index={1} />
			</div>

			{/* Unified Table Component */}
			<CategoryTable
				analytics={categoryAnalytics}
				isFetching={isFetching}
				refetch={refetch}
				pageSize={5}
				openEdit={openEdit}
			/>

			{/* Accessible Dialog Modal */}
			<AnimatePresence>
				{isModalVisible && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs"
						onClick={(e) => {
							if (e.target === e.currentTarget) closeModal();
						}}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.96, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 8 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
						>
							<button
								type="button"
								onClick={closeModal}
								className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
							>
								<X className="size-4" />
							</button>

							<h3 className="text-xl font-bold text-slate-900">
								{editingCategory ? "Edit Category" : "New Category"}
							</h3>
							<p className="mt-1 text-xs text-slate-500 leading-relaxed">
								{editingCategory
									? "Rename the category used across product forms and storefront filters."
									: "Create a new category group for organizing store products."}
							</p>

							<form onSubmit={handleSave} className="mt-6 space-y-4">
								<div className="space-y-1.5">
									<label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
										Category Label
									</label>
									<Input
										autoFocus
										value={categoryName}
										onChange={(e) => {
											setCategoryName(e.target.value);
											if (nameError) setNameError("");
										}}
										placeholder="e.g. Footwear, Accessories"
										className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 text-sm transition-all focus-visible:ring-emerald-800 ${
											nameError
												? "border-rose-500 focus-visible:ring-rose-500"
												: ""
										}`}
									/>
									{nameError && (
										<div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mt-1">
											<AlertCircleIcon className="size-3.5 shrink-0" />
											<span>{nameError}</span>
										</div>
									)}
								</div>

								<div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
									<Button
										type="button"
										variant="outline"
										onClick={closeModal}
										className="h-10 rounded-xl border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="h-10 rounded-xl bg-emerald-900 px-5 text-xs font-bold text-white transition-colors hover:bg-emerald-950 shadow-xs"
									>
										{isSubmitting ? (
											<>
												<Loader2Icon className="mr-1.5 size-3.5 animate-spin" />
												Saving...
											</>
										) : editingCategory ? (
											"Save Changes"
										) : (
											"Create Category"
										)}
									</Button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
};
