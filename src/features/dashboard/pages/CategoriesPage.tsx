import { useCallback, useEffect, useState } from "react";
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
import CategoryTable from "@/features/dashboard/components/categories/CategoryTable";
import { MetricCard } from "../components/shared/MetricCard";
import { PageHeader } from "../components/shared/PageHeader";
import z from "zod/v4";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const categorySchema = z.object({
	label: z.string().trim().min(1, "Category name cannot be empty."),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
	useDocumentTitle(`Categories Management | ${CONFIG.APP_NAME}`);

	const [createOpen, setCreateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<
		CategoryAnalytics[number] | null
	>(null);

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

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: { label: "" },
	});

	const closeModal = useCallback(() => {
		setCreateOpen(false);
		setEditOpen(false);
		setEditingCategory(null);
		reset({ label: "" });
	}, [reset]);

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
		setEditingCategory(null);
		reset({ label: "" });
		setCreateOpen(true);
	};

	const openEdit = (category: CategoryAnalytics[number]) => {
		setEditingCategory(category);
		reset({ label: category.label });
		setEditOpen(true);
	};

	const onSubmit = async (data: CategoryFormValues) => {
		const trimmed = data.label.trim();
		if (editingCategory) {
			await updateCategoryMutation.mutateAsync({
				id: editingCategory.id,
				label: trimmed,
			});
		} else {
			await createCategoryMutation.mutateAsync(trimmed);
		}

		closeModal();
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
						className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin text-brand-800" : ""}`}
					/>
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
				<MetricCard metric={metric} index={1} />
			</div>

			{/* Unified Table Component */}
			<CategoryTable
				analytics={categoryAnalytics}
				isFetching={isFetching}
				pageSize={5}
				openEdit={openEdit}
			/>

			{/* Accessible Dialog Modal */}
			<AnimatePresence>
				{isModalVisible && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 p-4 backdrop-blur-xs"
						onClick={(e) => {
							if (e.target === e.currentTarget) closeModal();
						}}
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

							<form
								onSubmit={handleSubmit(onSubmit)}
								className="mt-6 space-y-4"
							>
								<div className="space-y-1.5">
									<label className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
										Category Label
									</label>
									<Input
										autoFocus
										{...register("label")}
										placeholder="e.g. Footwear, Accessories"
										className={`h-11 rounded-lg border-brand-900/10 bg-surface-2/50 text-sm transition-all focus-visible:ring-brand-800 ${
											errors.label
												? "border-rose-500 focus-visible:ring-rose-500"
												: ""
										}`}
									/>
									{errors.label && (
										<div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mt-1">
											<AlertCircleIcon className="size-3.5 shrink-0" />
											<span>{errors.label.message}</span>
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
