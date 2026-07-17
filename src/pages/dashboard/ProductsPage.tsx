import { useEffect, useState, useRef, type SubmitEvent } from "react";
import { motion } from "framer-motion";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/core/config/constants";
// import { productService } from "@/features/products/services/productService";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { Tooltip } from "@/shared/components/ui/tooltip";
import {
	Search,
	Plus,
	Trash2,
	Edit,
	ExternalLink,
	X,
	RefreshCw,
	Package,
	Layers,
	AlertTriangle,
	BadgeDollarSign,
} from "lucide-react";
import type { Product } from "@/features/products/schemas/productSchema";
import {
	useCategoriesQuery,
	useCreateCategoryMutation,
} from "@/features/products/hooks/use-category";
import { useDashboardProducts } from "@/features/dashboard/hooks/use-dashboard";
import {
	useCreateProductMutation,
	useDeleteProductMutation,
	useProductsQuery,
	useUpdateProductMutation,
} from "@/features/products/hooks/use-product";

const CARD_MOTION = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.35 },
};

// const getSortedProducts = (items: Product[], sortBy: string) => {
// 	if (!items || items.length === 0) return [] satisfies Product[];
// 	const next = [...items];
// 	switch (sortBy) {
// 		case "createdAt,desc":
// 			return next.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
// 		case "oldest":
// 			return next.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
// 		case "name-desc":
// 			return next.sort((a, b) => b.name.localeCompare(a.name));
// 		case "price-asc":
// 			return next.sort((a, b) => a.price - b.price);
// 		case "price-desc":
// 			return next.sort((a, b) => b.price - a.price);
// 		default:
// 			return next.sort((a, b) => a.name.localeCompare(b.name));
// 	}
// };

export const ProductsPage = () => {
	useDocumentTitle(`Products Management | ${CONFIG.APP_NAME}`);
	// Data states
	const { data: categories } = useCategoriesQuery();
	const highlightTimeoutRef = useRef<number | null>(null);

	// Analytics State
	const { data: analytics, isPending, refetch } = useDashboardProducts();

	// Highlight state
	const [highlightedProductId, setHighlightedProductId] = useState<
		string | null
	>(null);

	// Modals states
	const [isProductModalOpen, setIsProductModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const createProductMutation = useCreateProductMutation();
	const updateProductMutation = useUpdateProductMutation();
	const deleteProductMutation = useDeleteProductMutation();

	// Confirm dialog state
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmTitle, setConfirmTitle] = useState("");
	const [confirmDesc, setConfirmDesc] = useState("");
	const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
	const [confirmDestructive, setConfirmDestructive] = useState(false);
	const [confirmText, setConfirmText] = useState("Continue");

	// Product Form state
	const [prodName, setProdName] = useState("");
	const [prodDesc, setProdDesc] = useState("");
	const [prodPrice, setProdPrice] = useState(0);
	const [prodStock, setProdStock] = useState(0);
	const [prodCategory, setProdCategory] = useState("");
	const [newCategoryName, setNewCategoryName] = useState("");
	const [categoryError, setCategoryError] = useState("");
	const [prodImage, setProdImage] = useState<File | null>(null);
	const [prodImagePreview, setProdImagePreview] = useState<string | null>(null);
	const [prodSubmitting, setProdSubmitting] = useState(false);
	const [categoryCreating, setCategoryCreating] = useState(false);
	const createCategoryMutation = useCreateCategoryMutation();

	// Validation states
	const [nameError, setNameError] = useState("");
	const [priceError, setPriceError] = useState("");
	const [stockError, setStockError] = useState("");
	const [imageError, setImageError] = useState("");

	// Search, Filtering and Pagination
	const [search, setSearch] = useState<string | undefined>(undefined);
	const [currentPage, setCurrentPage] = useState(0);
	const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
		string | undefined
	>(undefined);
	const [sortBy, setSortBy] = useState("createdAt,desc");
	const PRODUCTS_PER_PAGE = 10;
	const { data: productPage, refetch: refetchProducts } = useProductsQuery({
		q: search,
		page: currentPage,
		categoryId: selectedCategoryFilter,
		sort: sortBy,
	});

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setCurrentPage(0);
	};

	const handleCategoryFilterChange = (value: string) => {
		setSelectedCategoryFilter(value);
		setCurrentPage(0);
	};

	const handleSortByChange = (value: string) => {
		setSortBy(value);
		setCurrentPage(0);
	};

	const isFilterActive =
		!!search?.trim() || !!selectedCategoryFilter || sortBy !== "createdAt,desc";

	const handleResetFilters = () => {
		setSearch(undefined);
		setSelectedCategoryFilter(undefined);
		setSortBy("createdAt,desc");
		setCurrentPage(0);
	};

	useEffect(() => {
		return () => {
			if (highlightTimeoutRef.current !== null) {
				window.clearTimeout(highlightTimeoutRef.current);
			}
		};
	}, []);

	const showConfirm = (
		title: string,
		desc: string,
		action: () => void,
		isDestructive = false,
		confirmText = "Continue",
	) => {
		setConfirmTitle(title);
		setConfirmDesc(desc);
		setConfirmAction(() => action);
		setConfirmDestructive(isDestructive);
		setConfirmText(confirmText);
		setConfirmOpen(true);
	};

	// Reset product form fields
	const resetProductForm = () => {
		setProdName("");
		setProdDesc("");
		setProdPrice(0);
		setProdStock(0);
		setProdCategory(categories?.[0]?.id || "");
		setNewCategoryName("");
		setCategoryError("");
		setProdImage(null);
		setProdImagePreview(null);
		setEditingProduct(null);
		setNameError("");
		setPriceError("");
		setStockError("");
		setImageError("");
	};

	const openNewProductModal = () => {
		resetProductForm();
		setIsProductModalOpen(true);
	};

	const openEditProductModal = (product: Product) => {
		setEditingProduct(product);
		setProdName(product.name);
		setProdDesc(product.description ?? "");
		setProdPrice(product.price);
		setProdStock(product.stockQuantity);
		setProdCategory(product.category.id);
		setProdImage(null);
		setProdImagePreview(product.imageUrl);
		setIsProductModalOpen(true);
	};

	const createCategoryNow = async () => {
		const trimmedName = newCategoryName.trim();
		if (!trimmedName) {
			setCategoryError("Category name cannot be empty");
			return;
		}

		setCategoryCreating(true);
		setCategoryError("");

		try {
			const newCategory = await createCategoryMutation.mutateAsync(trimmedName);

			if (newCategory) {
				setProdCategory(newCategory.id);
				setNewCategoryName("");
			}
		} catch {
			setCategoryError("Failed to create category. Please try again.");
		} finally {
			setCategoryCreating(false);
		}
	};

	const promptCreateCategory = () => {
		showConfirm(
			"Create Category",
			newCategoryName.trim()
				? `Do you want to create the category "${newCategoryName.trim()}" and assign it to this product?`
				: "Do you want to create this category and assign it to this product?",
			createCategoryNow,
			false,
			"Create Category",
		);
	};

	const handleProductSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setProdSubmitting(true);

		const formData = new FormData();
		formData.append("name", prodName.trim());
		formData.append("description", prodDesc.trim());
		formData.append("price", prodPrice.toString());
		formData.append("stockQuantity", prodStock.toString());
		formData.append("categoryId", prodCategory);
		if (prodImage) formData.append("image", prodImage);

		const product = editingProduct
			? await updateProductMutation.mutateAsync({
					id: editingProduct.id,
					formData,
				})
			: await createProductMutation.mutateAsync(formData);

		if (product) {
			setIsProductModalOpen(false);
			resetProductForm();
			setSortBy("createdAt,desc");
			setCurrentPage(0);
			setHighlightedProductId(product.id);

			if (highlightTimeoutRef.current !== null) {
				window.clearTimeout(highlightTimeoutRef.current);
			}

			highlightTimeoutRef.current = window.setTimeout(() => {
				setHighlightedProductId(null);
				refetchProducts();
			}, 2000);

			await refetch();
		}
		setProdSubmitting(false);
	};

	const handleDeleteProduct = (productId: string) => {
		const product = productPage?.items.find((p) => p.id === productId);
		const productName = product ? product.name : "this product";

		showConfirm(
			"Delete Product",
			`Are you sure you want to delete "${productName}"? This action cannot be undone and will permanently remove this item from the catalog.`,
			async () => {
				await deleteProductMutation.mutate(productId);
				await refetch();
			},
			true,
			"Delete",
		);
	};

	if (isPending || !analytics || !categories || !productPage) {
		return (
			<div className="flex flex-col items-center justify-center min-h-100 gap-3">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-950" />
				<p className="text-xs text-slate-500 font-semibold">
					Loading catalog list...
				</p>
			</div>
		);
	}

	const tableTotalPages = productPage.totalPages;
	const tableTotalElements = productPage.totalElements;

	const start = currentPage * PRODUCTS_PER_PAGE + 1;
	const end = Math.min(
		(currentPage + 1) * PRODUCTS_PER_PAGE,
		productPage.totalElements,
	);

	const analystsCards = [
		{
			label: "Total Products",
			value: analytics.totalProducts,
			subtitle: "Across the catalog",
			accent: "bg-slate-50 text-slate-700",
			icon: Package,
		},
		{
			label: "Categories",
			value: analytics.totalCategories,
			subtitle: "Available product groups",
			accent: "bg-teal-50 text-teal-700",
			icon: Layers,
		},
		{
			label: "Low Stock",
			value: analytics.lowStockCount,
			subtitle: "Needs attention",
			accent: "bg-amber-50 text-amber-700",
			icon: AlertTriangle,
		},
		{
			label: "Avg Price",
			value: `${analytics.averagePrice.toFixed(2)} MAD`,
			subtitle: "Catalog average",
			accent: "bg-lime-50 text-lime-700",
			icon: BadgeDollarSign,
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">
						Products
					</p>
					<h2 className="text-2xl font-playfair text-slate-950 sm:text-3xl">
						Product list
					</h2>
					<p className="max-w-2xl text-sm text-slate-500">
						Manage catalog, pricing, and stock.
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
						onClick={openNewProductModal}
						className="h-10 rounded-xl bg-emerald-900 px-4 text-xs font-semibold text-white hover:bg-emerald-950"
					>
						<Plus className="mr-1.5 size-4" />
						New Product
					</Button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{analystsCards.map((metric, index) => {
					const Icon = metric.icon;

					return (
						<motion.div
							key={metric.label}
							{...CARD_MOTION}
							transition={{ duration: 0.35, delay: index * 0.05 }}
							className="relative overflow-hidden rounded-3xl border border-white bg-white p-5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)]"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
										{metric.label}
									</p>
									<h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
										{metric.value}
									</h3>
									<p className="mt-1 text-xs text-slate-500">
										{metric.subtitle}
									</p>
								</div>
								<div
									className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ring-slate-200/70 ${metric.accent}`}
								>
									<Icon className="size-5" />
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
				{/* Search, Filter, Sort Toolbar */}
				<div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 animate-in fade-in duration-200">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
						{/* Search Input */}
						<div className="relative flex-1">
							<Search
								className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400"
								strokeWidth={1.7}
							/>
							<Input
								value={search}
								onChange={(e) => handleSearchChange(e.target.value)}
								placeholder="Search products..."
								className="pl-9 rounded-xl border-slate-200 focus-visible:ring-emerald-800 text-xs h-9 bg-slate-50/30 w-full"
							/>
						</div>

						{/* Category Filter Dropdown */}
						<select
							value={selectedCategoryFilter}
							onChange={(e) => handleCategoryFilterChange(e.target.value)}
							className="h-9 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 cursor-pointer min-w-32.5"
						>
							<option value="all">All Categories</option>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>
									{cat.label}
								</option>
							))}
						</select>

						{/* Sort Dropdown */}
						<select
							value={sortBy}
							onChange={(e) => handleSortByChange(e.target.value)}
							className="h-9 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 cursor-pointer min-w-37.5"
						>
							<option value="createdAt,desc">Latest first</option>
							<option value="createdAt,asc">Oldest first</option>
							<option value="name,asc">Sort by Name (A-Z)</option>
							<option value="name,desc">Sort by Name (Z-A)</option>
							<option value="price,asc">Price: Low to High</option>
							<option value="price,desc">Price: High to Low</option>
						</select>

						{/* Reset Filters button */}
						{isFilterActive && (
							<Button
								variant="outline"
								onClick={handleResetFilters}
								className="h-9 px-3 rounded-xl border border-dashed border-red-200 text-xs font-semibold text-red-600 bg-red-50/25 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all duration-150 animate-in fade-in"
							>
								Reset
								<X className="size-3.5" />
							</Button>
						)}
					</div>

					<div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0 self-end md:self-auto select-none">
						<div className="text-xs text-slate-500 font-bold font-sans">
							{tableTotalElements === 0
								? "No items match criteria"
								: `Showing ${start}-${end} of ${tableTotalElements} items`}
						</div>
						{tableTotalPages > 1 && (
							<div className="flex items-center gap-1 border border-slate-100 rounded-lg p-0.5 bg-slate-50/50">
								<Button
									variant="outline"
									size="icon"
									disabled={currentPage === 0}
									onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
									className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center justify-center active:scale-95 transition-all"
									title="Previous Page"
								>
									&larr;
								</Button>
								<span className="text-[10px] font-bold text-slate-500 px-1.5 min-w-13.75 text-center">
									{currentPage} / {tableTotalPages}
								</span>
								<Button
									variant="outline"
									size="icon"
									disabled={currentPage === tableTotalPages}
									onClick={() =>
										setCurrentPage((p) => Math.min(tableTotalPages, p + 1))
									}
									className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center justify-center active:scale-95 transition-all"
									title="Next Page"
								>
									&rarr;
								</Button>
							</div>
						)}
					</div>
				</div>

				<div className="overflow-x-auto min-h-145">
					<table className="w-full text-left text-sm border-collapse">
						<thead>
							<tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
								<th className="px-6 py-4">ID</th>
								<th className="px-6 py-4">Product</th>
								<th className="px-6 py-4">Description</th>
								<th className="px-6 py-4">Category</th>
								<th className="px-6 py-4">Price</th>
								<th className="px-6 py-4">Quantity</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{productPage.items.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="px-6 py-12 text-center text-slate-400 text-xs font-semibold"
									>
										No products match your filter.
									</td>
								</tr>
							) : (
								productPage.items.map((product) => (
									<tr
										key={product.id}
										className={`group transition-colors duration-150 hover:bg-slate-50/40 ${
											highlightedProductId === product.id
												? "bg-emerald-50/80"
												: ""
										}`}
									>
										<td className="px-6 py-4">
											<Tooltip content={product.id}>
												<span className="text-[10px] font-sans text-slate-400 max-w-17.5 truncate select-all block cursor-help">
													{product.id}
												</span>
											</Tooltip>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="size-11 shrink-0 bg-slate-50 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-200">
													<img
														src={product.imageUrl}
														alt={product.name}
														className="h-full object-contain"
													/>
												</div>
												<div>
													<p className="font-bold text-slate-900 text-xs leading-normal">
														{product.name}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-slate-500 text-xs max-w-50 truncate">
											{product.description || "No description provided."}
										</td>
										<td className="px-6 py-4">
											<span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 border border-slate-200/50 text-slate-700 px-2 py-0.5 rounded-md inline-block">
												{product.category.label}
											</span>
										</td>
										<td className="px-6 py-4 font-semibold text-slate-900 text-xs">
											{product.price} MAD
										</td>
										<td className="px-6 py-4 font-semibold text-xs">
											<span
												className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md ${
													product.stockQuantity === 0
														? "bg-rose-50 text-rose-700 border border-rose-100/50"
														: product.stockQuantity < 10
															? "bg-amber-50 text-amber-700 border border-amber-100/50"
															: "bg-emerald-50 text-emerald-800 border border-emerald-100/50"
												}`}
											>
												{product.stockQuantity} units
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex items-center justify-end gap-1.5">
												<Tooltip content="View in Store">
													<button
														onClick={() =>
															window.open(`/product/${product.id}`, "_blank")
														}
														className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-slate-400 transition-colors cursor-pointer active:scale-95"
													>
														<ExternalLink className="size-3.5" />
													</button>
												</Tooltip>
												<Tooltip content="Edit Product">
													<button
														onClick={() => openEditProductModal(product)}
														className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-slate-400 transition-colors cursor-pointer active:scale-95"
													>
														<Edit className="size-3.5" />
													</button>
												</Tooltip>
												<Tooltip content="Delete Product">
													<button
														onClick={() => handleDeleteProduct(product.id)}
														className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-colors cursor-pointer active:scale-95"
													>
														<Trash2 className="size-3.5" />
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

				{/* Pagination footer */}
				{tableTotalPages > 1 && (
					<div className="p-4 border-t border-slate-100 bg-white flex items-center justify-center gap-2 select-none">
						<Button
							variant="outline"
							size="icon"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							className="h-8 w-8 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center justify-center"
						>
							&larr;
						</Button>

						{Array.from({ length: tableTotalPages }).map((_, i) => {
							const pageNum = i + 1;
							return (
								<Button
									key={pageNum}
									variant={currentPage === pageNum ? "default" : "outline"}
									onClick={() => setCurrentPage(pageNum)}
									className={`h-8 w-8 rounded-lg font-bold cursor-pointer transition-all text-xs flex items-center justify-center ${
										currentPage === pageNum
											? "bg-emerald-900 hover:bg-emerald-950 text-white border-emerald-900 shadow-sm"
											: "border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900"
									}`}
								>
									{pageNum}
								</Button>
							);
						})}

						<Button
							variant="outline"
							size="icon"
							disabled={currentPage === tableTotalPages}
							onClick={() =>
								setCurrentPage((p) => Math.min(tableTotalPages, p + 1))
							}
							className="h-8 w-8 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center justify-center"
						>
							&rarr;
						</Button>
					</div>
				)}
			</div>

			{/* MODAL: CREATE OR UPDATE PRODUCT */}
			{isProductModalOpen && (
				<div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
					<div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
						<button
							onClick={() => {
								resetProductForm();
								setIsProductModalOpen(false);
							}}
							className="absolute top-4 right-4 size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
						>
							<X className="size-4" />
						</button>

						<h3 className="font-sans text-xl font-semibold text-slate-950 mb-6">
							{editingProduct ? "Edit Product" : "New Supplement Product"}
						</h3>

						<form onSubmit={handleProductSubmit} className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-1.5">
									<label className="text-xs font-bold text-slate-600">
										Product Name *
									</label>
									<Input
										value={prodName}
										onChange={(e) => {
											setProdName(e.target.value);
											if (e.target.value.trim()) setNameError("");
										}}
										placeholder="e.g. Organic Greens Powder"
										required
										className={`rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 ${nameError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									/>
									{nameError && (
										<p className="text-[10px] font-semibold text-red-500 mt-0.5">
											{nameError}
										</p>
									)}
								</div>
								<div className="space-y-1.5">
									<label className="text-xs font-bold text-slate-600">
										Category *
									</label>
									<select
										value={prodCategory}
										onChange={(e) => setProdCategory(e.target.value)}
										required
										className="flex h-10 w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
									>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="grid gap-3 sm:grid-cols-[1fr_auto]">
								<div className="space-y-1.5">
									<label className="text-xs font-bold text-slate-600">
										Add New Category
									</label>
									<Input
										value={newCategoryName}
										onChange={(e) => {
											setNewCategoryName(e.target.value);
											if (categoryError) setCategoryError("");
										}}
										placeholder="e.g. Immune Support"
										className={`rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 ${categoryError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									/>
									{categoryError && (
										<p className="text-[10px] font-semibold text-red-500 mt-0.5">
											{categoryError}
										</p>
									)}
								</div>
								<div className="flex items-end">
									<Button
										type="button"
										variant="outline"
										onClick={promptCreateCategory}
										disabled={categoryCreating}
										className="h-10 px-4 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs cursor-pointer"
									>
										{categoryCreating ? "Creating..." : "Add Category"}
									</Button>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-1.5">
									<label className="text-xs font-bold text-slate-600">
										Price (MAD) *
									</label>
									<Input
										type="number"
										step="0.01"
										value={prodPrice}
										onChange={(e) => {
											setProdPrice(+e.target.value);
											const val = parseFloat(e.target.value);
											if (!isNaN(val) && val > 0) setPriceError("");
										}}
										placeholder="e.g. 29.99"
										required
										className={`rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 ${priceError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									/>
									{priceError && (
										<p className="text-[10px] font-semibold text-red-500 mt-0.5">
											{priceError}
										</p>
									)}
								</div>
								<div className="space-y-1.5">
									<label className="text-xs font-bold text-slate-600">
										Stock Quantity
									</label>
									<Input
										type="number"
										value={prodStock}
										onChange={(e) => {
											setProdStock(+e.target.value);
											const stkVal = parseInt(e.target.value);
											if (!isNaN(stkVal) && stkVal >= 0) setStockError("");
										}}
										placeholder="e.g. 100"
										className={`rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 ${stockError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
									/>
									{stockError && (
										<p className="text-[10px] font-semibold text-red-500 mt-0.5">
											{stockError}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-slate-600">
									Description / Flavor Details
								</label>
								<textarea
									value={prodDesc}
									onChange={(e) => setProdDesc(e.target.value)}
									placeholder="Describe the product formula, flavor profiles, and wellness benefits..."
									rows={3}
									className="flex min-h-20 w-full rounded-xl border border-emerald-900/10 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-xs font-bold text-slate-600">
									Product Thumbnail *
								</label>
								<div
									className={`relative group border-2 border-dashed rounded-2xl p-6 bg-slate-50/40 hover:bg-emerald-50/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2.5 min-h-35 ${
										imageError
											? "border-red-500 hover:border-red-600"
											: "border-emerald-900/10 hover:border-emerald-800/50"
									}`}
								>
									{prodImagePreview ? (
										<div className="flex flex-col items-center gap-2">
											<div className="size-20 rounded-xl overflow-hidden bg-white p-1 border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
												<img
													src={prodImagePreview}
													alt="Preview"
													className="h-full object-contain"
												/>
											</div>
											<span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-800 transition-colors">
												Click to replace image
											</span>
										</div>
									) : (
										<div className="flex flex-col items-center gap-2">
											<div className="p-3 bg-emerald-50 rounded-full text-emerald-800 group-hover:scale-110 transition-transform duration-200">
												<Plus className="size-5" />
											</div>
											<div className="space-y-0.5">
												<span className="text-xs font-bold text-slate-700 block">
													Upload Product Image
												</span>
												<span className="text-[10px] text-slate-400 block">
													PNG, JPG, or WEBP up to 5MB
												</span>
											</div>
										</div>
									)}
									<input
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												setProdImage(file);
												setProdImagePreview(URL.createObjectURL(file));
												setImageError("");
											}
										}}
										className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
									/>
								</div>
								{imageError && (
									<p className="text-[10px] font-semibold text-red-500 mt-0.5">
										{imageError}
									</p>
								)}
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6 animate-in fade-in duration-200">
								<Button
									type="button"
									variant="ghost"
									onClick={() => {
										resetProductForm();
										setIsProductModalOpen(false);
									}}
									className="h-10 px-5 rounded-xl cursor-pointer font-semibold text-xs text-slate-700 hover:bg-slate-50"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={prodSubmitting}
									className="h-10 px-5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
								>
									{prodSubmitting
										? "Saving..."
										: editingProduct
											? "Save Changes"
											: "Create Product"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Confirm Dialog */}
			<ConfirmDialog
				isOpen={confirmOpen}
				title={confirmTitle}
				description={confirmDesc}
				confirmText={confirmText}
				isDestructive={confirmDestructive}
				onConfirm={confirmAction || (() => {})}
				onClose={() => setConfirmOpen(false)}
			/>
		</div>
	);
};
