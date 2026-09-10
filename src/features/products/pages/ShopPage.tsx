import { useState, useEffect } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";

import { useProducts } from "@/features/products/services/product/queries";
import { useCategories } from "@/features/products/services/category/queries";
import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { ProductGrid } from "@/features/products/components/product/ProductsGrid";
import {
	initialPaginations,
	ITEMS_PER_PAGE,
	type Paginations,
} from "@/features/products/types/filters";
import { useProductFilters } from "@/features/products/hooks/use-product-filters";
import { PaginationControllers } from "@/features/products/components/pagination/PaginationControllers";
import { FilterBadges } from "@/features/products/components/filters/FilterBadges";
import { PaginationHeader } from "@/features/products/components/pagination/PaginationHeader";
import { ProductFilter } from "@/features/products/components/filters/ProductFilter";
import { MobileProductFilter } from "@/features/products/components/filters/MobileProductFilter";

export default function ShopPage() {
	const { data: categories } = useCategories();
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
	const [paginations, setPaginations] = useState<Paginations>(initialPaginations);

	const { filters, setFilters, handleResetFilters, goalCategoryId } = useProductFilters();

	// Track the previous filters stringified to reset pagination safely during render
	// without triggering a cascading setState loop via useEffect.
	const [prevFiltersKey, setPrevFiltersKey] = useState(JSON.stringify(filters));
	const currentFiltersKey = JSON.stringify(filters);

	if (prevFiltersKey !== currentFiltersKey) {
		setPrevFiltersKey(currentFiltersKey);
		if (paginations.page !== 0) {
			setPaginations((prev) => ({ ...prev, page: 0 }));
		}
	}

	// A selected goal resolves to its category; a manual category pill wins only
	// when no goal is active.
	const categoryId = goalCategoryId ?? filters.categoryId;

	// Fetch product page data
	const { data: productPage, isPending } = useProducts({
		page: paginations.page,
		size: ITEMS_PER_PAGE,
		q: filters.query?.trim(),
		minPrice: filters.price?.min,
		maxPrice: filters.price?.max,
		categoryId,
		sort: paginations.sort,
	});

	useDocumentTitle(`Shop | ${CONFIG.APP_NAME}`);

	const selectedCategory = categories?.find((c) => c.id === categoryId);
	const totalProducts = productPage?.totalElements ?? 0;
	const totalPages = productPage?.totalPages ?? 0;

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [paginations.page]);

	return (
		<>
			{/* Shop Banner / Header */}
			<section className="mt-4 rounded-b-[2.55rem] sm:rounded-b-[3rem] bg-brand-950 px-4 py-12 sm:py-20 text-center text-white shadow-md">
				<div className="mx-auto max-w-3xl">
					<p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-lime-300">
						Clean & Pure Ingredients
					</p>
					<h1 className="mt-2.5 sm:mt-3 font-playfair text-3xl sm:text-5xl font-normal leading-tight">
						Shop
					</h1>
					<p className="mx-auto mt-3 sm:mt-4 max-w-xl font-sans text-xs sm:text-base leading-relaxed text-brand-50/80">
						Explore our curated selection of high-grade supplement formulas,
						thoughtfully made for your daily ritual.
					</p>
				</div>
			</section>

			{/* Shop Main Content Layout */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 overflow-x-hidden">
				<Breadcrumbs
					items={[{ label: "Home", href: APP_ROUTES.HOME }, { label: "Shop" }]}
					className="mb-6" />
				<div className="grid items-start gap-8 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)]">
					<div className="hidden lg:block sticky top-24">
						<ProductFilter />
					</div>

					{/* Product Catalog Column with minmax(0,1fr) to prevent flex/grid blowouts */}
					<div className="space-y-6 min-w-0">
						{/* Top Toolbar Controls */}
						<PaginationHeader
							paginations={paginations}
							setPaginations={setPaginations}
							totalPages={totalPages}
							totalItems={totalProducts}
							setIsMobileFiltersOpen={setIsMobileFiltersOpen} />

						{/* Active Filter Badges Display */}
						<FilterBadges
							filters={filters}
							setFilters={setFilters}
							selectedCategory={selectedCategory} />

						{/* Product Cards Grid */}
						<ProductGrid
							productPage={productPage}
							isPending={isPending}
							filters={filters}
							paginations={paginations}
							handleResetFilters={handleResetFilters} />

						{/* Bottom Pagination Controls */}
						<PaginationControllers
							paginations={paginations}
							setPaginations={setPaginations}
							totalPages={totalPages} />
					</div>
				</div>
			</main>

			{/* Mobile Filters Drawer Modal */}
			<MobileProductFilter
				totalItems={totalProducts}
				isOpen={isMobileFiltersOpen}
				setIsOpen={setIsMobileFiltersOpen} />
		</>
	);
}
