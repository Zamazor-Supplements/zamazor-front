import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
	createCategorySchema,
	type Category,
	type CreateCategoryFormValues,
} from "@/features/products/schemas/categorySchema";
import {
	createProductSchema,
	type CreateProductInput,
	type CreateProductOutput,
	type Product,
} from "@/features/products/schemas/productSchema";
import {
	AlertCircleIcon,
	Loader2Icon,
	CheckIcon,
	UploadCloudIcon,
	XIcon,
} from "lucide-react";

interface ProductFormModalProps {
	isOpen: boolean;
	editingProduct: Product | null;
	categories: Category[];
	onClose: () => void;
	onSubmit: (values: CreateProductOutput) => Promise<void> | void;
	onCreateCategory: (name: string) => Promise<Category>;
}
export const ProductFormModal = ({
	isOpen,
	editingProduct,
	categories,
	onClose,
	onSubmit,
	onCreateCategory,
}: ProductFormModalProps) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [categoryError, setCategoryError] = useState("");
	const [isCreatingCategory, setIsCreatingCategory] = useState(false);
	const [showAddCategory, setShowAddCategory] = useState(false);
	const [categorySuccess, setCategorySuccess] = useState(false);

	const isEditing = Boolean(editingProduct);

	const defaultValues = useMemo<CreateProductInput>(
		() => ({
			name: editingProduct?.name ?? "",
			description: editingProduct?.description ?? "",
			price: editingProduct?.price ?? 0,
			stockQuantity: editingProduct?.stockQuantity ?? 0,
			categoryId: editingProduct?.category.id ?? categories[0]?.id ?? "",
			image: undefined,
		}),
		[editingProduct, categories],
	);

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateProductInput, undefined, CreateProductOutput>({
		resolver: zodResolver(createProductSchema),
		defaultValues,
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

	// const handleRemoveImage = (e: React.MouseEvent) => {
	//   e.stopPropagation();
	//   if (previewUrl?.startsWith("blob:")) {
	//     URL.revokeObjectURL(previewUrl);
	//   }
	//   setPreviewUrl(null);
	//   setValue("image", undefined, { shouldDirty: true, shouldValidate: true });
	// };

	const handleCreateCategory = async (values: CreateCategoryFormValues) => {
		setCategoryError("");
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

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
					<div>
						<h3 className="text-xl font-bold text-slate-900">
							{isEditing ? "Edit Product" : "New Supplement Product"}
						</h3>
						<p className="text-xs text-slate-500 mt-0.5">
							{isEditing
								? "Update inventory records and pricing details."
								: "Fill out the information below to register a new product."}
						</p>
					</div>
					<button
						type="button"
						onClick={handleClose}
						disabled={isSubmitting}
						className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-50"
					>
						<XIcon className="size-4" />
					</button>
				</div>

				{/* Main Form */}
				<form
					onSubmit={handleSubmit(async (data) => {
						await onSubmit(data);
					})}
				>
					<fieldset disabled={isSubmitting} className="space-y-4">
						{/* Title & Category Row */}
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-slate-700">
									Product Name <span className="text-rose-500">*</span>
								</label>
								<Input
									{...register("name")}
									placeholder="e.g. Organic Greens Powder"
									className={`rounded-xl border-slate-200 focus-visible:ring-emerald-700 ${
										errors.name
											? "border-rose-500 focus-visible:ring-rose-500"
											: ""
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
									<label className="text-xs font-semibold text-slate-700">
										Category <span className="text-rose-500">*</span>
									</label>
									<button
										type="button"
										onClick={() => setShowAddCategory(!showAddCategory)}
										className="text-[11px] font-semibold text-emerald-700 hover:underline"
									>
										{showAddCategory ? "Cancel" : "+ New Category"}
									</button>
								</div>
								<select
									{...register("categoryId")}
									className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
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
							<div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 space-y-2 animate-in fade-in duration-150">
								<p className="text-xs font-semibold text-emerald-900">
									Add New Category
								</p>
								<div className="flex gap-2">
									<Input
										{...createCategoryForm.register("label")}
										placeholder="e.g. Immune Support"
										className="rounded-xl border-slate-200 bg-white focus-visible:ring-emerald-700"
									/>
									<Button
										type="button"
										onClick={createCategoryForm.handleSubmit(
											handleCreateCategory,
										)}
										disabled={isCreatingCategory}
										className="h-10 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white hover:bg-emerald-900 shrink-0"
									>
										{isCreatingCategory ? (
											<Loader2Icon className="size-4 animate-spin" />
										) : categorySuccess ? (
											<CheckIcon className="size-4 text-emerald-200" />
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
								{categoryError && (
									<p className="text-[11px] font-medium text-rose-600">
										{categoryError}
									</p>
								)}
							</div>
						)}

						{/* Price & Stock Row */}
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-slate-700">
									Price (MAD) <span className="text-rose-500">*</span>
								</label>
								<Input
									type="number"
									step="0.01"
									{...register("price", { valueAsNumber: true })}
									placeholder="e.g. 299.00"
									className={`rounded-xl border-slate-200 focus-visible:ring-emerald-700 ${
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
								<label className="text-xs font-semibold text-slate-700">
									Stock Quantity
								</label>
								<Input
									type="number"
									{...register("stockQuantity", { valueAsNumber: true })}
									placeholder="e.g. 100"
									className={`rounded-xl border-slate-200 focus-visible:ring-emerald-700 ${
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
							<label className="text-xs font-semibold text-slate-700">
								Description / Formula Notes
							</label>
							<textarea
								{...register("description")}
								placeholder="Describe product dosage, key ingredients, and target benefits..."
								rows={3}
								className="flex min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
							/>
						</div>

						{/* Thumbnail Upload */}
						<div className="space-y-2">
							<label className="text-xs font-semibold text-slate-700">
								Product Image
							</label>
							<div
								className={`group relative flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
									errors.image
										? "border-rose-400 bg-rose-50/30 hover:border-rose-500"
										: "border-slate-200 bg-slate-50/50 hover:border-emerald-700/60 hover:bg-emerald-50/20"
								}`}
							>
								{(previewUrl ?? editingProduct?.imageUrl) ? (
									<div className="relative flex flex-col items-center gap-2">
										<div className="relative size-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition-transform duration-200 group-hover:scale-105">
											<img
												src={previewUrl ?? editingProduct?.imageUrl}
												alt="Preview"
												className="h-full w-full object-contain"
											/>
										</div>
										{/* <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-slate-900/80 text-white shadow hover:bg-rose-600"
                    >
                      <XIcon className="size-3.5" />
                    </button> */}
										<span className="text-[11px] font-semibold text-slate-500 group-hover:text-emerald-800">
											Click or drag to replace image
										</span>
									</div>
								) : (
									<div className="flex flex-col items-center gap-1.5">
										<div className="rounded-full bg-emerald-100/60 p-2.5 text-emerald-800 group-hover:scale-110 transition-transform">
											<UploadCloudIcon className="size-5" />
										</div>
										<div>
											<span className="block text-xs font-semibold text-slate-700">
												Upload Product Thumbnail
											</span>
											<span className="block text-[10px] text-slate-400 mt-0.5">
												PNG, JPG, or WEBP up to 5MB
											</span>
										</div>
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
					<div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isSubmitting}
							className="h-10 rounded-xl border-slate-200 px-5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-6 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 active:scale-95 disabled:opacity-60"
						>
							{isSubmitting ? (
								<>
									<Loader2Icon className="size-3.5 animate-spin" />
									<span>
										{isEditing ? "Saving Changes..." : "Creating Product..."}
									</span>
								</>
							) : (
								<span>{isEditing ? "Save Changes" : "Create Product"}</span>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
