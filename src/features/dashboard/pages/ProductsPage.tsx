import { useEffect, useRef, useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { PlusIcon, RotateCwIcon } from "lucide-react";
import type {
	CreateProductOutput,
	Product,
	UpdateProductOutput,
} from "@/features/products/schemas/productSchema";
import { useCategories } from "@/features/products/services/category/queries";
import { useCreateCategory } from "@/features/products/services/category/mutations";
import { useDashboardProducts } from "@/features/dashboard/services/queries";
import { useProducts } from "@/features/products/services/product/queries";
import {
	DASHBOARD_PRODUCT_PAGE_SIZE,
	useDashboardProductFilters,
	type DashboardProductSort,
} from "@/features/dashboard/hooks/use-dashboard-product-filters";
import {
	ProductFiltersToolbar,
	type ProductFilters,
} from "@/features/dashboard/components/products/ProductFiltersToolbar";
import { ProductFormModal } from "@/features/dashboard/components/products/ProductFormModal";
import { ProductTable } from "@/features/dashboard/components/products/ProductTable";
import { keepPreviousData } from "@tanstack/react-query";
import { ProductPageSkeleton } from "@/features/dashboard/components/products/ProductPageSkeleton";
import { AnalyticsCards } from "@/features/dashboard/components/shared/AnalyticsCards";
import { PageHeader } from "@/features/dashboard/components/shared/PageHeader";
import { PRODUCT_METRICS_CONFIG } from "@/features/dashboard/config/metrics";
import {
	useCreateProduct,
	useDeleteProduct,
	useUpdateProduct,
} from "@/features/products/services/product/mutations";

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

export default function ProductsPage() {
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
	const { filters, updateFilters, setPage, resetFilters, isFilterActive } =
		useDashboardProductFilters();

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

	const {
		data: productPage,
		isLoading: isLoadingProducts,
		isFetching: isFetchingProducts,
		refetch: refetchProducts,
	} = useProducts(
		{
			q: filters.search.trim() || undefined,
			categoryId: filters.categoryId || undefined,
			page: filters.page,
			size: DASHBOARD_PRODUCT_PAGE_SIZE,
			sort: filters.sort,
		},
		{
			placeholderData: keepPreviousData,
		},
	);

	const handleRefetchAll = async () => {
		await Promise.all([refetchProducts(), refetchAnalytics()]);
	};

	const handlePageChange = (page: number) => {
		setPage(page);
	};

	const handleFiltersChange = (next: Partial<ProductFilters>) => {
		const cleaned = Object.fromEntries(
			Object.entries({ ...next, page: 0 }).filter(([, v]) => v !== undefined),
		);
		updateFilters(cleaned);
	};

	const handleSortChange = (sort: DashboardProductSort) => {
		updateFilters({ sort, page: 0 });
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

	const handleCreateProduct = async (values: CreateProductOutput) => {
		const product = await createProductMutation.mutateAsync(values);

		if (product) {
			closeProductModal();
			resetFilters();
			setHighlightedProductId(product.id);

			if (highlightTimeoutRef.current) {
				window.clearTimeout(highlightTimeoutRef.current);
			}

			highlightTimeoutRef.current = window.setTimeout(() => {
				setHighlightedProductId(null);
			}, 2200);
		}
	};

	const handleUpdateProduct = async (values: UpdateProductOutput) => {
		if (!modal.editingProduct) return;

		const product = await updateProductMutation.mutateAsync({
			id: modal.editingProduct.id,
			data: values,
		});

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
			action: () => {
				deleteProductMutation.mutate(productId);
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
			<PageHeader
				eyebrow={
					<span className="inline-flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-brand-600" />
						Inventory Control
					</span>
				}
				title="Product Catalog"
				description="Monitor inventory levels, adjust unit pricing, and manage stock distribution."
			>
				<Button
					variant="outline"
					onClick={handleRefetchAll}
					disabled={isFetching}
					className="h-9.5 rounded-lg border-brand-900/10 bg-card px-3.5 text-xs font-semibold text-ink shadow-sm hover:bg-surface-2 hover:text-ink active:scale-95 disabled:opacity-60"
				>
					<RotateCwIcon
						className={`mr-2 size-3.5 ${isFetching ? "animate-spin text-brand-700" : "text-ink-faint"}`}
					/>
					Refresh
				</Button>

				<Button
					onClick={() => openProductModal()}
					className="h-9.5 px-4 text-xs font-semibold"
				>
					<PlusIcon className="mr-1.5 size-4 stroke-[2.5]" />
					Add Product
				</Button>
			</PageHeader>

			{/* Analytics Cards Header */}
			{analytics && (
				<AnalyticsCards metrics={PRODUCT_METRICS_CONFIG(analytics)} />
			)}

			{/* Main Table Wrapper */}
			<div className="relative overflow-hidden rounded-lg border border-brand-900/10 bg-card shadow-sm">
				<ProductFiltersToolbar
					filters={{
						search: filters.search,
						categoryId: filters.categoryId,
					}}
					sort={filters.sort}
					totalElements={productPage.totalElements}
					categories={categories}
					isFilterActive={isFilterActive}
					onFiltersChange={handleFiltersChange}
					onSortChange={handleSortChange}
					onResetFilters={resetFilters}
				/>

				<ProductTable
					productPage={productPage}
					isFetching={isFetchingProducts}
					highlightedProductId={highlightedProductId}
					onEditProduct={openProductModal}
					onDeleteProduct={handleDeleteProduct}
					onPageChange={handlePageChange}
				/>
			</div>

			{/* Modals */}
			{modal.editingProduct ? (
				<ProductFormModal
					key={modal.editingProduct.id}
					isOpen={modal.open}
					mode="edit"
					editingProduct={modal.editingProduct}
					categories={categories}
					onClose={closeProductModal}
					onSubmit={handleUpdateProduct}
					onCreateCategory={handleCreateCategory}
				/>
			) : (
				<ProductFormModal
					key="new"
					isOpen={modal.open}
					mode="create"
					categories={categories}
					onClose={closeProductModal}
					onSubmit={handleCreateProduct}
					onCreateCategory={handleCreateCategory}
				/>
			)}

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
}
