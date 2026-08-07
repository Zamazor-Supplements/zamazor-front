import { useEffect, useRef, useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import type {
	CreateProductOutput,
	Product,
} from "@/features/products/schemas/productSchema";
import { useCategories } from "@/features/products/services/category/queries";
import { useCreateCategory } from "@/features/products/services/category/mutations";
import { useDashboardProducts } from "@/features/dashboard/services/queries";
import { useProducts } from "@/features/products/services/product/queries";
import { ProductAnalyticsCards } from "@/features/dashboard/components/products/ProductAnalyticsCards";
import { ProductFiltersToolbar } from "@/features/dashboard/components/products/ProductFiltersToolbar";
import { ProductFormModal } from "@/features/dashboard/components/products/ProductFormModal";
import { ProductTable } from "@/features/dashboard/components/products/ProductTable";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { keepPreviousData } from "@tanstack/react-query";
import { ProductPageSkeleton } from "@/features/dashboard/components/products/ProductPageSkeleton";
import {
	useCreateProduct,
	useDeleteProduct,
	useUpdateProduct,
} from "@/features/products/services/product/mutations";

type Filters = {
	search: string;
	categoryId: string;
};

type Sort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "name,asc"
	| "name,desc"
	| "price,asc"
	| "price,desc";

type Pagination = {
	page: number;
	sort: Sort;
	size: number;
};

type ModalState = {
	open: boolean;
	editingProduct: Product | null;
};

type ConfirmState = {
	open: boolean;
	title: string;
	description: string;
	action: (() => Promise<void> | void) | null;
	destructive: boolean;
	confirmText: string;
};

const PRODUCTS_PER_PAGE = 6;

const DEFAULT_FILTERS: Filters = {
	search: "",
	categoryId: "",
};

const DEFAULT_PAGINATION: Pagination = {
	page: 0,
	size: PRODUCTS_PER_PAGE,
	sort: "createdAt,desc",
};

export const ProductsPage = () => {
	useDocumentTitle(`Products Management | ${CONFIG.APP_NAME}`);

	const { data: categories = [], isLoading: isLoadingCategories } =
		useCategories();
	const highlightTimeoutRef = useRef<number | null>(null);

	const {
		data: analytics,
		isPending: isAnalyticsPending,
		isFetching,
		refetch: refetchAnalytics,
	} = useDashboardProducts();

	const [highlightedProductId, setHighlightedProductId] = useState<
		string | null
	>(null);
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
	const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);

	const [modal, setModal] = useState<ModalState>({
		open: false,
		editingProduct: null,
	});

	const [confirm, setConfirm] = useState<ConfirmState>({
		open: false,
		title: "",
		description: "",
		action: null,
		destructive: false,
		confirmText: "Continue",
	});

	const createProductMutation = useCreateProduct();
	const updateProductMutation = useUpdateProduct();
	const deleteProductMutation = useDeleteProduct();
	const createCategoryMutation = useCreateCategory();

	const debouncedSearch = useDebounce(filters.search, 500);

	const {
		data: productPage,
		isLoading: isLoadingProducts,
		isFetching: isFetchingProducts,
		refetch: refetchProducts,
	} = useProducts(
		{
			q: debouncedSearch.trim() || undefined,
			categoryId: filters.categoryId || undefined,
			page: pagination.page,
			size: pagination.size,
			sort: pagination.sort,
		},
		{
			placeholderData: keepPreviousData,
		},
	);

	const isFilterActive =
		Boolean(filters.search.trim()) ||
		Boolean(filters.categoryId) ||
		pagination.sort !== DEFAULT_PAGINATION.sort;

	const handleRefetchAll = async () => {
		await Promise.all([refetchProducts(), refetchAnalytics()]);
	};

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, page }));
	};

	const resetFilters = () => {
		setFilters(DEFAULT_FILTERS);
		setPagination(DEFAULT_PAGINATION);
	};

	useEffect(() => {
		return () => {
			if (highlightTimeoutRef.current !== null) {
				window.clearTimeout(highlightTimeoutRef.current);
			}
		};
	}, []);

	const openProductModal = (product?: Product) => {
		setModal({ open: true, editingProduct: product ?? null });
	};

	const closeProductModal = () => {
		setModal({ open: false, editingProduct: null });
	};

	const openConfirm = ({
		title,
		description,
		action,
		destructive = false,
		confirmText = "Continue",
	}: Omit<ConfirmState, "open">) => {
		setConfirm({
			open: true,
			title,
			description,
			action,
			destructive,
			confirmText,
		});
	};

	const closeConfirm = () => {
		setConfirm((prev) => ({ ...prev, open: false }));
	};

	const handleCreateCategory = async (categoryName: string) => {
		const trimmedName = categoryName.trim();
		return await createCategoryMutation.mutateAsync(trimmedName);
	};

	const handleProductSubmit = async (values: CreateProductOutput) => {
		const product = modal.editingProduct
			? await updateProductMutation.mutateAsync({
					id: modal.editingProduct.id,
					data: values,
				})
			: await createProductMutation.mutateAsync(values);

		if (product) {
			closeProductModal();
			resetFilters();
			setHighlightedProductId(product.id);

			if (highlightTimeoutRef.current !== null) {
				window.clearTimeout(highlightTimeoutRef.current);
			}

			highlightTimeoutRef.current = window.setTimeout(() => {
				setHighlightedProductId(null);
			}, 2200);
		}
	};

	const handleDeleteProduct = (productId: string) => {
		const product = productPage?.items.find((item) => item.id === productId);
		const productName = product ? product.name : "this product";

		openConfirm({
			title: "Delete Product",
			description: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
			action: async () => {
				await deleteProductMutation.mutateAsync(productId);
				await handleRefetchAll();
			},
			destructive: true,
			confirmText: "Delete",
		});
	};

	// Modern Initial Loading Check (Skeleton View)
	const isInitialLoading =
		isAnalyticsPending || isLoadingCategories || isLoadingProducts;

	if (isInitialLoading || !productPage) {
		return <ProductPageSkeleton />;
	}
	return (
		<div className="space-y-6">
			{/* Header Title & Actions */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
				<div>
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-emerald-600" />
						<p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
							Inventory Control
						</p>
					</div>
					<h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
						Product Catalog
					</h1>
					<p className="mt-1 text-xs text-slate-500">
						Monitor inventory levels, adjust unit pricing, and manage stock
						distribution.
					</p>
				</div>

				<div className="flex items-center gap-2.5">
					<Button
						variant="outline"
						onClick={handleRefetchAll}
						disabled={isFetching}
						className="h-9.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:opacity-60"
					>
						<RefreshCwIcon
							className={`mr-2 size-3.5 ${isFetching ? "animate-spin text-emerald-700" : "text-slate-400"}`}
						/>
						Refresh
					</Button>

					<Button
						onClick={() => openProductModal()}
						className="h-9.5 rounded-xl bg-emerald-800 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-900 active:scale-95"
					>
						<PlusIcon className="mr-1.5 size-4 stroke-[2.5]" />
						Add Product
					</Button>
				</div>
			</div>

			{/* Analytics Cards Header */}
			{analytics && <ProductAnalyticsCards analytics={analytics} />}

			{/* Main Table Wrapper */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
				<ProductFiltersToolbar
					filters={filters}
					pagination={pagination}
					totalElements={productPage?.totalElements ?? 0}
					categories={categories}
					isFilterActive={isFilterActive}
					updateFilters={(newFilters: Partial<Filters>) => {
						setFilters((prev) => ({ ...prev, ...newFilters }));
						setPagination((prev) => ({ ...prev, page: 0 }));
					}}
					updatePagination={(newPagination: Partial<Pagination>) =>
						setPagination((prev) => ({ ...prev, page: 0, ...newPagination }))
					}
					onResetFilters={resetFilters}
				/>

				{productPage && (
					<ProductTable
						productPage={productPage}
						isFetching={isFetchingProducts}
						highlightedProductId={highlightedProductId}
						onEditProduct={openProductModal}
						onDeleteProduct={handleDeleteProduct}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			{/* Modals */}
			<ProductFormModal
				key={modal.editingProduct?.id ?? "new"}
				isOpen={modal.open}
				editingProduct={modal.editingProduct}
				categories={categories}
				onClose={closeProductModal}
				onSubmit={handleProductSubmit}
				onCreateCategory={handleCreateCategory}
			/>

			<ConfirmDialog
				isOpen={confirm.open}
				title={confirm.title}
				description={confirm.description}
				confirmText={confirm.confirmText}
				isDestructive={confirm.destructive}
				isLoading={deleteProductMutation.isPending}
				onConfirm={async () => {
					if (confirm.action) await confirm.action();
				}}
				onClose={closeConfirm}
			/>
		</div>
	);
};
