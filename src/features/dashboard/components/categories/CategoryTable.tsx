import {
	Edit2Icon,
	FolderKanbanIcon,
	FolderXIcon,
	Trash2Icon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import {
	DataTable,
	type DataTableColumn,
	type SortOption,
} from "@/shared/components/ui/data-table";
import { useDeleteCategory } from "@/features/products/services/category/mutations";
import type { CategoryAnalytics } from "../../schemas/dashboardSchema";

type Category = CategoryAnalytics[number];

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
	openEdit: (category: Category) => void;
}

export default function CategoryTable({
	analytics,
	pageSize = 8,
	isFetching = false,
	refetch,
	openEdit,
}: CategoryTableProps) {
	const [confirmState, setConfirmState] = useState<ConfirmState>(
		INITIAL_CONFIRM_STATE,
	);

	const deleteCategoryMutation = useDeleteCategory();

	const closeConfirm = () => setConfirmState(INITIAL_CONFIRM_STATE);

	const handleDelete = (category: Category) => {
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

	const columns: DataTableColumn<Category>[] = [
		{
			header: "Category",
			className: "max-w-md",
			render: (category) => (
				<div className="flex items-center gap-3.5">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand-900/10 bg-brand-50/50 text-brand-800">
						<FolderKanbanIcon className="size-5" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-xs font-semibold text-ink">
							{category.label}
						</p>
						<p className="mt-0.5 truncate text-[11px] text-ink-soft">
							{category.productCount > 0
								? "Used in store catalog"
								: "Not linked to any product"}
						</p>
					</div>
				</div>
			),
		},
		{
			header: "ID",
			render: (category) => (
				<Tooltip content={`ID: ${category.id}`}>
					<span className="shrink-0 cursor-help select-all rounded border border-brand-900/10 bg-surface-2 px-1.5 py-0.5 text-[9px] font-mono text-ink-soft">
						#{category.id.slice(0, 8)}
					</span>
				</Tooltip>
			),
		},
		{
			header: "Linked Products",
			render: (category) => (
				<span className="inline-flex items-center rounded-md border border-brand-900/10 bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-ink">
					{category.productCount} products
				</span>
			),
		},
		{
			header: "Usage Status",
			render: (category) => (
				<span
					className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
						category.productCount > 0
							? "bg-brand-50 text-brand-700 border-brand-200/60"
							: "bg-amber-50 text-amber-700 border-amber-200/60"
					}`}
				>
					<span
						className={`size-1.5 rounded-full ${
							category.productCount > 0 ? "bg-brand-500" : "bg-amber-500"
						}`}
					/>
					{category.productCount > 0 ? "Active" : "Unused"}
				</span>
			),
		},
		{
			header: "Actions",
			align: "right",
			render: (category) => (
				<div className="flex items-center justify-end gap-1">
					<Tooltip content="Edit Category">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => openEdit(category)}
							className="rounded-lg p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink active:scale-95"
						>
							<Edit2Icon className="size-4" />
						</Button>
					</Tooltip>
					<Tooltip content="Delete Category">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleDelete(category)}
							className="rounded-lg p-1.5 text-ink-faint hover:bg-rose-50 hover:text-rose-600 active:scale-95"
						>
							<Trash2Icon className="size-4" />
						</Button>
					</Tooltip>
				</div>
			),
		},
	];

	const filterFn = (rows: Category[], search: string): Category[] => {
		const q = search.trim().toLowerCase();
		return rows.filter(
			(c) =>
				c.id.toLowerCase().includes(q) || c.label.toLowerCase().includes(q),
		);
	};

	const sortOptions: SortOption[] = [
		{ value: "label,asc", label: "Label A-Z" },
		{ value: "label,desc", label: "Label Z-A" },
		{ value: "products,desc", label: "Most products" },
		{ value: "products,asc", label: "Least products" },
	];

	const sortFn = (rows: Category[], sortBy: string): Category[] =>
		[...rows].sort((a, b) => {
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

	return (
		<>
			<DataTable
				columns={columns}
				rows={analytics ?? []}
				rowKey={(category) => category.id}
				itemLabel="categories"
				searchPlaceholder="Search categories..."
				filterFn={filterFn}
				sortOptions={sortOptions}
				defaultSort="label,asc"
				sortFn={sortFn}
				pageSize={pageSize}
				loading={isFetching}
				emptyIcon={FolderXIcon}
				emptyTitle="No categories found"
				emptyDescription="No categories matched your current search filters."
			/>

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
