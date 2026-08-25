import { useCallback, useEffect, useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	AlertCircleIcon,
	FolderKanbanIcon,
	Loader2Icon,
	PlusIcon,
	RotateCwIcon,
	XIcon,
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
import { PageHeader } from "../components/shared/PageHeader";

export default function CategoriesPage() {
	useDocumentTitle(`Categories Management | ${CONFIG.APP_NAME}`);

	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		CategoryAnalytics[number] | null
	>(null);
	const [categoryName, setCategoryName] = useState("");
	const [nameError, setNameError] = useState("");

	const {
		data: categoryAnalytics, isPending, isFetching, refetch,
	} = useDashboardCategories();

	const createCategoryMutation = useCreateCategory();
	const updateCategoryMutation = useUpdateCategory();

	const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

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
						<div className="h-3 w-28 rounded-md bg-surface-2" />
						<div className="h-8 w-56 rounded-lg bg-surface-2" />
						<div className="h-4 w-80 rounded-md bg-surface-2" />
					</div>
					<div className="flex items-center gap-2">
						<div className="h-10 w-24 rounded-lg bg-surface-2" />
						<div className="h-10 w-36 rounded-lg bg-surface-2" />
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div className="h-28 rounded-xl border border-brand-900/10 bg-surface-2/70 p-5" />
				</div>

				<div className="h-96 rounded-xl border border-brand-900/10 bg-surface-2/70 p-6" />
			</div>
		);
	}

	const isModalVisible = createOpen || editOpen;

	const metric = {
		label: "Total Categories",
		value: String(categoryAnalytics.length),
		subtitle: "Active in catalog navigation",
		icon: FolderKanbanIcon,
		accent: "bg-brand-50 text-brand-800 border-brand-100",
		alert: false,
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<PageHeader
				eyebrow="Catalog Settings"
				title="Categories Management"
				description="Manage catalog groupings and keep storefront navigation structured."
			>
				<Button
					variant="outline"
					onClick={() => refetch()}
					disabled={isFetching}
					className="h-10 rounded-lg border-brand-900/10 text-xs font-semibold text-ink transition-colors hover:bg-surface-2"
				>
					<RotateCwIcon
						className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin text-brand-800" : ""}`} />
					Refresh
				</Button>

				<Button
					onClick={openCreate}
					className="h-10 px-4 text-xs font-semibold"
				>
					<PlusIcon className="mr-1.5 size-4" />
					New Category
				</Button>
			</PageHeader>

			{/* Metric Cards */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{/* <motion.div
                {...cardMotion}
                className="relative overflow-hidden rounded-xl border border-brand-900/10 bg-card p-5 shadow-xs"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                            Total Categories
                        </p>
                        <h3 className="mt-1 truncate text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                            {categoryAnalytics.length}
                        </h3>
                        <p className="mt-1 text-[11px] font-medium text-ink-soft">
                            Active in catalog navigation
                        </p>
                    </div>
                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-800 border border-brand-100">
                        <FolderKanbanIcon className="size-5" />
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
				openEdit={openEdit} />

			{/* Accessible Dialog Modal */}
			<AnimatePresence>
				{isModalVisible && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 p-4 backdrop-blur-xs"
						onClick={(e) => {
							if (e.target === e.currentTarget) closeModal();
						} }
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.96, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 8 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							className="relative w-full max-w-md rounded-xl border border-brand-900/10 bg-card p-6 shadow-2xl sm:p-8"
						>
							<button
								type="button"
								onClick={closeModal}
								className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint transition-colors hover:bg-brand-100 hover:text-ink"
							>
								<XIcon className="size-4" />
							</button>

							<h3 className="text-xl font-bold text-ink">
								{editingCategory ? "Edit Category" : "New Category"}
							</h3>
							<p className="mt-1 text-xs text-ink-soft leading-relaxed">
								{editingCategory
									? "Rename the category used across product forms and storefront filters."
									: "Create a new category group for organizing store products."}
							</p>

							<form onSubmit={handleSave} className="mt-6 space-y-4">
								<div className="space-y-1.5">
									<label className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
										Category Label
									</label>
									<Input
										autoFocus
										value={categoryName}
										onChange={(e) => {
											setCategoryName(e.target.value);
											if (nameError) setNameError("");
										} }
										placeholder="e.g. Footwear, Accessories"
										className={`h-11 rounded-lg border-brand-900/10 bg-surface-2/50 text-sm transition-all focus-visible:ring-brand-800 ${nameError
												? "border-rose-500 focus-visible:ring-rose-500"
												: ""}`} />
									{nameError && (
										<div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mt-1">
											<AlertCircleIcon className="size-3.5 shrink-0" />
											<span>{nameError}</span>
										</div>
									)}
								</div>

								<div className="flex items-center justify-end gap-2.5 pt-4 border-t border-brand-900/10">
									<Button
										type="button"
										variant="outline"
										onClick={closeModal}
										className="h-10 rounded-lg border-brand-900/10 px-4 text-xs font-semibold text-ink hover:bg-surface-2"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="h-10 px-5 text-xs font-bold"
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
}
