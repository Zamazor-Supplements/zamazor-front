import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";

import { useProducts } from "@/features/products/services/product/queries";
import { useCategories } from "@/features/products/services/category/queries";
import CONFIG from "@/app/config/constants";
import { ProductGrid } from "@/features/products/components/product/ProductsGrid";
import {
	initialFilters,
	initialPaginations,
	ITEMS_PER_PAGE,
	type Filters,
	type Paginations,
} from "@/features/products/types/filters";
import { PaginationControllers } from "@/features/products/components/pagination/PaginationControllers";
import { FilterBadges } from "@/features/products/components/filters/FilterBadges";
import { PaginationHeader } from "@/features/products/components/pagination/PaginationHeader";
import { ProductFilter } from "@/features/products/components/filters/ProductFilter";
import { MobileProductFilter } from "@/features/products/components/filters/MobileProductFilter";

export const ShopPage = () => {
	const { data: categories } = useCategories();
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
	const [paginations, setPaginations] =
		useState<Paginations>(initialPaginations);
	const [filters, setFilters] = useState<Filters>(initialFilters);

	// Fetch product page data
	const { data: productPage, isPending } = useProducts({
		page: paginations.page,
		size: ITEMS_PER_PAGE,
		q: filters.query?.trim(),
		minPrice: filters.price?.min,
		maxPrice: filters.price?.max,
		categoryId: filters.categoryId,
		sort: paginations.sort,
	});

	useDocumentTitle(`Shop | ${CONFIG.APP_NAME}`);

	const selectedCategory = categories?.find((c) => c.id === filters.categoryId);
	const totalProducts = productPage?.totalElements ?? 0;
	const totalPages = productPage?.totalPages ?? 0;

	const handleSetFilters: Dispatch<SetStateAction<Filters>> = (action) => {
		setFilters(action);
		setPaginations((prev) => ({ ...prev, page: 0 }));
	};

	const handleResetFilters = () => {
		setPaginations(initialPaginations);
		setFilters(initialFilters);
	};

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [paginations.page]);

	return (
		<>
			{/* Shop Banner / Header */}
			<section className="mt-4 rounded-b-[3rem] bg-emerald-950 px-4 py-16 text-center text-white sm:py-20">
				<div className="mx-auto max-w-3xl">
					<p className="text-xs font-bold uppercase tracking-widest text-lime-300">
						Clean & Pure Ingredients
					</p>
					<h1 className="mt-3 font-playfair text-4xl font-normal leading-tight sm:text-5xl">
						Shop
					</h1>
					<p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-emerald-50/80 sm:text-base">
						Explore our curated selection of high-grade supplement formulas,
						thoughtfully made for your daily ritual.
					</p>
				</div>
			</section>

			{/* Shop Main Content Layout */}
			<main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 overflow-x-hidden">
				<div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
					{/* Desktop Filters Sidebar */}
					<ProductFilter
						filters={filters}
						setFilters={handleSetFilters}
						handleResetFilters={handleResetFilters}
					/>

					{/* Product Catalog Column with minmax(0,1fr) to prevent flex/grid blowouts */}
					<div className="space-y-6 min-w-0">
						{/* Top Toolbar Controls */}
						<PaginationHeader
							paginations={paginations}
							setPaginations={setPaginations}
							totalPages={totalPages}
							totalItems={totalProducts}
							setIsMobileFiltersOpen={setIsMobileFiltersOpen}
						/>

						{/* Active Filter Badges Display */}
						<FilterBadges
							filters={filters}
							setFilters={handleSetFilters}
							selectedCategory={selectedCategory}
						/>

						{/* Product Cards Grid */}
						<ProductGrid
							productPage={productPage}
							isPending={isPending}
							filters={filters}
							paginations={paginations}
							handleResetFilters={handleResetFilters}
						/>

						{/* Bottom Pagination Controls */}
						<PaginationControllers
							paginations={paginations}
							setPaginations={setPaginations}
							totalPages={totalPages}
						/>
					</div>
				</div>
			</main>
			{/* Mobile Filters Drawer Modal */}
			<MobileProductFilter
				filters={filters}
				setFilters={handleSetFilters}
				handleResetFilters={handleResetFilters}
				totalItems={totalProducts}
				isOpen={isMobileFiltersOpen}
				setIsOpen={setIsMobileFiltersOpen}
			/>
		</>
	);
};
