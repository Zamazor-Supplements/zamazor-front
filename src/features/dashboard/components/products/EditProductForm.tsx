import {
	updateProductSchema,
	type UpdateProductInput,
	type UpdateProductOutput,
} from "@/features/products/schemas/productSchema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ProductFormModalProps } from "./ProductFormModal";
import {
	createCategorySchema,
	type CreateCategoryFormValues,
} from "@/features/products/schemas/categorySchema";
import { useState } from "react";

type EditProductFormProps = Extract<ProductFormModalProps, { mode: "edit" }>;

export const EditProductForm = ({
	editingProduct,
	categories,
	onClose,
	onSubmit,
	onCreateCategory,
}: EditProductFormProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isCreatingCategory, setIsCreatingCategory] = useState(false);
	const [showAddCategory, setShowAddCategory] = useState(false);
	const [categorySuccess, setCategorySuccess] = useState(false);

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UpdateProductInput, undefined, UpdateProductOutput>({
		resolver: zodResolver(updateProductSchema),
		defaultValues: {
			name: editingProduct.name,
			description: editingProduct.description ?? undefined,
			price: editingProduct.price,
			stockQuantity: editingProduct.stockQuantity,
			categoryId: editingProduct.category.id,
			image: undefined,
		},
	});

	const createCategoryForm = useForm<CreateCategoryFormValues>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: { label: "" },
	});

	const handleClose = () => {
		if (previewUrl?.startsWith("blob:")) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl(null);
		setShowAddCategory(false);
		onClose();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (previewUrl?.startsWith("blob:")) {
			URL.revokeObjectURL(previewUrl);
		}

		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		setValue("image", file, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const handleCreateCategory = async (values: CreateCategoryFormValues) => {
		setCategorySuccess(false);
		setIsCreatingCategory(true);

		try {
			const category = await onCreateCategory(values.label);
			setValue("categoryId", category.id, { shouldValidate: true });
			setCategorySuccess(true);
			setTimeout(() => {
				setCategorySuccess(false);
				setShowAddCategory(false);
			}, 1200);
		} finally {
			setIsCreatingCategory(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<fieldset disabled={isSubmitting} className="space-y-4">
				{/* Title & Category Row */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-ink">
							Product Name <span className="text-rose-500">*</span>
						</label>
						<Input
							{...register("name")}
							placeholder="e.g. Organic Greens Powder"
							className={`rounded-lg border-brand-900/10 focus-visible:ring-brand-700 ${
								errors.name ? "border-rose-500 focus-visible:ring-rose-500" : ""
							}`}
						/>
						{errors.name && (
							<p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
								<AlertCircleIcon className="size-3" />
								{errors.name.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<label className="text-xs font-semibold text-ink">
								Category <span className="text-rose-500">*</span>
							</label>
							<button
								type="button"
								onClick={() => setShowAddCategory(!showAddCategory)}
								className="text-[11px] font-semibold text-brand-700 hover:underline"
							>
								{showAddCategory ? "Cancel" : "+ New Category"}
							</button>
						</div>
						<select
							{...register("categoryId")}
							className="flex h-10 w-full rounded-lg border border-brand-900/10 bg-card px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
						>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.label}
								</option>
							))}
						</select>
						{errors.categoryId && (
							<p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
								<AlertCircleIcon className="size-3" />
								{errors.categoryId.message}
							</p>
						)}
					</div>
				</div>

				{/* Collapsible Add Category Panel */}
				{showAddCategory && (
					<div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5 space-y-2 animate-in fade-in duration-150">
						<p className="text-xs font-semibold text-brand-900">
							Add New Category
						</p>
						<div className="flex gap-2">
							<Input
								{...createCategoryForm.register("label")}
								placeholder="e.g. Immune Support"
								className="rounded-lg border-brand-900/10 bg-card focus-visible:ring-brand-700"
							/>
							<Button
								type="button"
								onClick={createCategoryForm.handleSubmit(handleCreateCategory)}
								disabled={isCreatingCategory}
								className="h-10 shrink-0 px-4 text-xs font-semibold"
							>
								{isCreatingCategory ? (
									<Loader2Icon className="size-4 animate-spin" />
								) : categorySuccess ? (
									<CheckIcon className="size-4 text-brand-200" />
								) : (
									"Add"
								)}
							</Button>
						</div>
						{createCategoryForm.formState.errors.label && (
							<p className="text-[11px] font-medium text-rose-600">
								{createCategoryForm.formState.errors.label.message}
							</p>
						)}
					</div>
				)}

				{/* Price & Stock Row */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-ink">
							Price (MAD) <span className="text-rose-500">*</span>
						</label>
						<Input
							type="number"
							step="0.01"
							{...register("price", { valueAsNumber: true })}
							placeholder="e.g. 299.00"
							className={`rounded-lg border-brand-900/10 focus-visible:ring-brand-700 ${
								errors.price
									? "border-rose-500 focus-visible:ring-rose-500"
									: ""
							}`}
						/>
						{errors.price && (
							<p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
								<AlertCircleIcon className="size-3" />
								{errors.price.message}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-ink">
							Stock Quantity
						</label>
						<Input
							type="number"
							{...register("stockQuantity", { valueAsNumber: true })}
							placeholder="e.g. 100"
							className={`rounded-lg border-brand-900/10 focus-visible:ring-brand-700 ${
								errors.stockQuantity
									? "border-rose-500 focus-visible:ring-rose-500"
									: ""
							}`}
						/>
						{errors.stockQuantity && (
							<p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
								<AlertCircleIcon className="size-3" />
								{errors.stockQuantity.message}
							</p>
						)}
					</div>
				</div>

				{/* Description */}
				<div className="space-y-1.5">
					<label className="text-xs font-semibold text-ink">
						Description / Formula Notes
					</label>
					<textarea
						{...register("description")}
						placeholder="Describe product dosage, key ingredients, and target benefits..."
						rows={3}
						className="flex min-h-20 w-full rounded-lg border border-brand-900/10 bg-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
					/>
				</div>

				{/* Thumbnail Upload */}
				<div className="space-y-2">
					<label className="text-xs font-semibold text-ink">
						Product Image
					</label>
					<div
						className={`group relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
							errors.image
								? "border-rose-400 bg-rose-50/30 hover:border-rose-500"
								: "border-brand-900/10 bg-surface-2/50 hover:border-brand-700/60 hover:bg-brand-50/20"
						}`}
					>
						{(previewUrl ?? editingProduct?.imageUrl) ? (
							<div className="relative flex flex-col items-center gap-2">
								<div className="relative size-20 overflow-hidden rounded-lg border border-brand-900/10 bg-card p-1 shadow-sm transition-transform duration-200 group-hover:scale-105">
									<img
										src={previewUrl ?? editingProduct?.imageUrl}
										alt="Preview"
										className="h-full w-full object-contain"
									/>
								</div>
								<span className="text-[11px] font-semibold text-ink-soft group-hover:text-brand-800">
									Click or drag to replace image
								</span>
							</div>
						) : (
							<div>
								<span className="block text-xs font-semibold text-ink">
									Upload Product Thumbnail
								</span>
								<span className="block text-[10px] text-ink-faint mt-0.5">
									PNG, JPG, or WEBP up to 5MB
								</span>
							</div>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
						/>
					</div>
					{errors.image && (
						<p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 mt-1">
							<AlertCircleIcon className="size-3" />
							{errors.image.message}
						</p>
					)}
				</div>
			</fieldset>
			{/* Footer Actions */}
			<div className="mt-6 flex items-center justify-end gap-3 border-t border-brand-900/10 pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={handleClose}
					disabled={isSubmitting}
					className="h-10 rounded-lg border-brand-900/10 px-5 text-xs font-semibold text-ink hover:bg-surface-2"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="h-10 gap-2 px-6 text-xs font-bold"
				>
					{isSubmitting ? (
						<>
							<Loader2Icon className="size-3.5 animate-spin" />
							<span>Saving Changes...</span>
						</>
					) : (
						<span>Save Changes</span>
					)}
				</Button>
			</div>
		</form>
	);
};
