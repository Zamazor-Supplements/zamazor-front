import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
	SlidersHorizontal,
	X,
	Check,
	ArrowUpDown,
	SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useLanguage } from "@/shared/context/LanguageContext";
import { AuthStatus } from "@/features/auth/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useProductsQuery } from "@/features/products/hooks/use-product";
import { useCategoriesQuery } from "@/features/products/hooks/use-category";

type SortOption =
	| "createdAt,desc"
	| "createdAt,asc"
	| "name,asc"
	| "name,desc"
	| "price,asc"
	| "price,desc";

interface PriceRange {
	minPrice: undefined | number;
	maxPrice: undefined | number;
}
const initialPriceRange = {
	minPrice: undefined,
	maxPrice: undefined,
} satisfies PriceRange;

const ITEMS_PER_PAGE = 6;

interface SortOptionConfig {
	value: SortOption;
	label: string;
}

export const ShopPage = () => {
	const { language, t } = useLanguage();
	const isAuthenticated =
		useAuthStore((state) => state.status) === AuthStatus.Authenticated;

	const priceCategories = [
		{
			id: "all",
			label: language === "fr" ? "Tous les prix" : "All Prices",
			minPrice: undefined,
			maxPrice: undefined,
		},
		{
			id: "under-25",
			label: language === "fr" ? "Moins de 25 MAD" : "Under 25 MAD",
			minPrice: undefined,
			maxPrice: 25,
		},
		{
			id: "25-40",
			label: language === "fr" ? "25 à 40 MAD" : "25 to 40 MAD",
			minPrice: 25,
			maxPrice: 40,
		},
		{
			id: "over-40",
			label: language === "fr" ? "Plus de 40 MAD" : "Over 40 MAD",
			minPrice: 40,
			maxPrice: undefined,
		},
	];

	const sortOptions: SortOptionConfig[] = [
		{ value: "createdAt,desc", label: "Newest first" },
		{ value: "createdAt,asc", label: "Oldest first" },
		{ value: "name,asc", label: t("shop.sortName") },
		{ value: "name,desc", label: "Name Z-A" },
		{ value: "price,asc", label: t("shop.sortPriceLow") },
		{ value: "price,desc", label: t("shop.sortPriceHigh") },
	];

	useDocumentTitle(`${t("shop.title")} | Zamazor`);

	const [loadingProducts] = useState(false);
	const { data: categories } = useCategoriesQuery();
	const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
	const [selectedCategoryId, setSelectedCategoryId] = useState<
		string | undefined
	>(undefined);
	const [sort, setSort] = useState<SortOption>("name,asc");
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);
	const [currentPage, setCurrentPage] = useState(0);

	const { data: productPage } = useProductsQuery({
		page: currentPage,
		size: ITEMS_PER_PAGE,
		q: searchQuery?.trim(),
		minPrice: priceRange.minPrice,
		maxPrice: priceRange.maxPrice,
		categoryId: selectedCategoryId,
		sort,
	});

	const totalProducts = productPage?.totalElements ?? 0;
	const totalPages = productPage?.totalPages ?? 0;

	const isPriceFiltersActive =
		priceRange.minPrice !== undefined || priceRange.maxPrice !== undefined;
	const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

	const countMessage = useMemo(() => {
		if (totalProducts === 0)
			return language === "fr"
				? "Affichage de 0 formules propres"
				: "Showing 0 clean formulas";
		const start = currentPage * ITEMS_PER_PAGE + 1;
		const end = Math.min((currentPage + 1) * ITEMS_PER_PAGE, totalProducts);
		return language === "fr"
			? `Affichage de ${start}–${end} sur ${totalProducts} formules propres`
			: `Showing ${start}–${end} of ${totalProducts} clean formulas`;
	}, [currentPage, language, totalProducts]);

	const handleResetFilters = () => {
		setSearchQuery(undefined);
		setSelectedCategoryId(undefined);
		setSort("name,asc");
		setCurrentPage(0);
	};

	return (
		<>
			{/* Shop Banner */}
			<section className="bg-emerald-950 text-white py-16 sm:py-20 mt-4 rounded-b-[3rem] text-center px-4">
				<div className="max-w-3xl mx-auto">
					<p className="text-xs font-bold uppercase tracking-widest text-lime-300">
						{t("homepage.hero.badge1")}
					</p>
					<h1 className="mt-3 text-4xl sm:text-5xl font-playfair font-normal leading-tight">
						{t("shop.title")}
					</h1>
					<p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-emerald-50/80 leading-relaxed font-sans">
						{t("shop.desc")}
					</p>
				</div>
			</section>

			{/* Shop Main content Grid */}
			<main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-8 lg:grid-cols-[250px_1fr] items-start">
					{/* Desktop Filters Sidebar */}
					<aside className="hidden lg:block space-y-6">
						{/* Filter heading */}
						<div className="flex items-center justify-between border-b border-slate-100 pb-4">
							<h3 className="font-playfair text-lg font-bold text-slate-900">
								{language === "fr" ? "Filtres" : "Filters"}
							</h3>
							<button
								onClick={handleResetFilters}
								className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
							>
								{language === "fr" ? "Réinitialiser" : "Clear all"}
							</button>
						</div>

						{/* Search input */}
						<div className="space-y-2">
							<label className="text-xs font-black uppercase text-slate-400 tracking-wider">
								{t("common.search")}
							</label>
							<div className="relative">
								<SearchIcon className="absolute left-3 top-3 size-4 text-slate-400" />
								<Input
									type="text"
									placeholder="e.g. Protein, Matcha"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="h-10 pl-9 rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800"
								/>
							</div>
						</div>

						{/* Categories Filter */}
						<div className="space-y-2.5">
							<label className="text-xs font-black uppercase text-slate-400 tracking-wider">
								{language === "fr" ? "Catégorie" : "Category"}
							</label>
							<div className="flex flex-col gap-1.5">
								{categories?.map((cat) => (
									<button
										key={cat.id}
										onClick={() => setSelectedCategoryId(cat.id)}
										className={cn(
											"flex items-center justify-between text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer",
											selectedCategoryId === cat.id
												? "bg-emerald-50 text-emerald-900 font-bold"
												: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
										)}
									>
										<span>{cat.label}</span>
										{selectedCategoryId === cat.id && (
											<Check className="size-3.5 text-emerald-800" />
										)}
									</button>
								))}
							</div>
						</div>

						{/* Price Range Filter */}
						<div className="space-y-2.5">
							<label className="text-xs font-black uppercase text-slate-400 tracking-wider">
								{language === "fr" ? "Gamme de prix" : "Price Range"}
							</label>
							<div className="flex flex-col gap-1.5">
								{priceCategories.map((opt) => (
									<button
										key={opt.id}
										onClick={() =>
											setPriceRange({
												minPrice: opt.minPrice,
												maxPrice: opt.maxPrice,
											})
										}
										className={cn(
											"flex items-center justify-between text-left text-sm py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer",
											priceRange.minPrice === opt.minPrice &&
												priceRange.maxPrice === opt.maxPrice
												? "bg-emerald-50 text-emerald-900 font-bold"
												: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
										)}
									>
										<span>{opt.label}</span>
										{priceRange.minPrice === opt.minPrice &&
											priceRange.maxPrice === opt.maxPrice && (
												<Check className="size-3.5 text-emerald-800" />
											)}
									</button>
								))}
							</div>
						</div>
					</aside>
					{/* Product Catalog side */}
					<div className="space-y-6">
						{/* Controls & Mob trigger */}
						<div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 flex-wrap">
							<div className="flex items-center gap-3">
								{/* Mobile filter button */}
								<Button
									onClick={() => setMobileFiltersOpen(true)}
									variant="outline"
									size="sm"
									className="lg:hidden h-10 px-4 rounded-xl border-emerald-900/10 text-emerald-800 flex items-center gap-1.5"
								>
									<SlidersHorizontal className="size-4" />
									Filters
								</Button>
								<span className="text-xs font-bold text-slate-500 font-sans">
									{countMessage}
								</span>
							</div>

							<div className="flex items-center gap-3">
								{/* Mini Pagination Navigation */}
								{totalPages > 1 && (
									<div className="flex items-center gap-2 bg-white border border-emerald-900/10 rounded-xl px-2.5 py-1 h-10 select-none">
										<button
											disabled={currentPage === 0}
											onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
											className="text-emerald-800 hover:text-emerald-950 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm cursor-pointer p-0.5"
											title="Previous Page"
										>
											&larr;
										</button>
										<span className="text-xs font-bold text-slate-600 font-sans px-1">
											{currentPage + 1}/{totalPages}
										</span>
										<button
											disabled={currentPage === totalPages}
											onClick={() =>
												setCurrentPage((p) => Math.min(totalPages, p + 1))
											}
											className="text-emerald-800 hover:text-emerald-950 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm cursor-pointer p-0.5"
											title="Next Page"
										>
											&rarr;
										</button>
									</div>
								)}

								{/* Sort Selector */}
								<div className="flex items-center gap-2">
									<ArrowUpDown className="size-4 text-slate-400" />
									<select
										value={sort}
										onChange={(e) => setSort(e.target.value as SortOption)}
										className="h-10 rounded-xl border border-emerald-900/10 bg-white px-3 py-1 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800 cursor-pointer shadow-xs"
									>
										{sortOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Active filter badges display */}
						{(selectedCategoryId ||
							priceRange.maxPrice ||
							priceRange.minPrice ||
							searchQuery) && (
							<div className="flex flex-wrap gap-2 items-center">
								<span className="text-xs font-bold text-slate-400 mr-1 uppercase">
									{language === "fr" ? "Filtres actifs:" : "Active filters:"}
								</span>
								{searchQuery && (
									<span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
										"{searchQuery}"
										<X
											className="size-3 text-slate-500 hover:text-slate-800 cursor-pointer"
											onClick={() => setSearchQuery(undefined)}
										/>
									</span>
								)}
								{selectedCategory && (
									<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-900/10">
										{selectedCategory.label}
										<X
											className="size-3 text-emerald-700 hover:text-emerald-900 cursor-pointer"
											onClick={() => setSelectedCategoryId(undefined)}
										/>
									</span>
								)}
								{isPriceFiltersActive && (
									<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-900/10">
										{!priceRange.minPrice && priceRange.maxPrice === 25
											? "Under 25 MAD"
											: priceRange.minPrice === 25 && priceRange.maxPrice === 40
												? "25 to 40 MAD"
												: "Over 40 MAD"}
										<X
											className="size-3 text-emerald-700 hover:text-emerald-900 cursor-pointer"
											onClick={() => setPriceRange(initialPriceRange)}
										/>
									</span>
								)}
							</div>
						)}

						{/* Product Grid */}
						{loadingProducts ? (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{[...Array(6)].map((_, i) => (
									<div
										key={i}
										className="rounded-3xl border border-emerald-950/5 bg-white p-4 shadow-sm animate-pulse space-y-4"
									>
										<div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center">
											<div className="size-20 bg-slate-100 rounded-full animate-pulse" />
										</div>
										<div className="h-4 bg-slate-100 rounded-full w-2/3" />
										<div className="h-3 bg-slate-50 rounded-full w-1/3" />
										<div className="flex items-center justify-between pt-4">
											<div className="h-5 bg-slate-100 rounded-full w-1/4" />
											<div className="h-9 bg-slate-100 rounded-xl w-1/3" />
										</div>
									</div>
								))}
							</div>
						) : !productPage || productPage.items.length === 0 ? (
							<div className="text-center py-20 bg-white rounded-3xl border border-emerald-900/5 px-6">
								<SlidersHorizontal className="size-16 text-emerald-900/25 mx-auto mb-4" />
								<h3 className="text-xl font-playfair text-slate-900 font-bold">
									No supplement blends found
								</h3>
								<p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
									We couldn't find any clean supplements matching your filters.
									Try checking different categories or search queries.
								</p>
								<Button
									onClick={handleResetFilters}
									className="mt-6 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl h-11 px-6 font-bold cursor-pointer"
								>
									Reset filters
								</Button>
							</div>
						) : (
							<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
								{productPage.items.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										isAuthenticated={isAuthenticated}
									/>
								))}
							</div>
						)}

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-emerald-900/5 select-none">
								<Button
									variant="outline"
									size="icon"
									disabled={currentPage === 0}
									onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
									className="h-9 w-9 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
								>
									&larr;
								</Button>

								{Array.from({ length: totalPages }).map((_, i) => {
									return (
										<Button
											key={i}
											variant={currentPage === i ? "default" : "outline"}
											onClick={() => setCurrentPage(i)}
											className={cn(
												"h-9 w-9 rounded-xl font-bold cursor-pointer transition-all text-xs",
												currentPage === i
													? "bg-emerald-900 hover:bg-emerald-950 text-white border-emerald-900 shadow-sm"
													: "border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900",
											)}
										>
											{i + 1}
										</Button>
									);
								})}

								<Button
									variant="outline"
									size="icon"
									disabled={currentPage === totalPages}
									onClick={() =>
										setCurrentPage((p) => Math.min(totalPages, p + 1))
									}
									className="h-9 w-9 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
								>
									&rarr;
								</Button>
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Mobile Filters Drawer Modal */}
			{mobileFiltersOpen && (
				<div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/50 backdrop-blur-sm">
					<div className="ml-auto w-full max-w-xs bg-white p-6 h-full flex flex-col justify-between shadow-2xl relative animate-slide-left select-none">
						<div>
							{/* Modal Header */}
							<div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
								<h3 className="font-playfair text-lg font-bold text-slate-900">
									{language === "fr" ? "Filtres" : "Filters"}
								</h3>
								<button
									onClick={() => setMobileFiltersOpen(false)}
									className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
								>
									<X className="size-5" />
								</button>
							</div>

							{/* Search input mobile */}
							<div className="space-y-2 mb-6">
								<label className="text-xs font-black uppercase text-slate-400 tracking-wider">
									{t("common.search")}
								</label>
								<div className="relative">
									<SearchIcon className="absolute left-3 top-3 size-4 text-slate-400" />
									<Input
										type="text"
										placeholder="e.g. Protein, Matcha"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="h-10 pl-9 rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800"
									/>
								</div>
							</div>

							{/* Categories Filter mobile */}
							<div className="space-y-2.5 mb-6">
								<label className="text-xs font-black uppercase text-slate-400 tracking-wider">
									{language === "fr" ? "Catégorie" : "Category"}
								</label>
								<div className="flex flex-wrap gap-1.5">
									{categories?.map((cat) => (
										<button
											key={cat.id}
											onClick={() => setSelectedCategoryId(cat.id)}
											className={cn(
												"text-xs font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
												selectedCategoryId === cat.id
													? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
													: "bg-white text-emerald-800 border-emerald-900/10 hover:bg-emerald-50",
											)}
										>
											{cat.label}
										</button>
									))}
								</div>
							</div>

							{/* Price Range Filter mobile */}
							<div className="space-y-2.5 mb-6">
								<label className="text-xs font-black uppercase text-slate-400 tracking-wider">
									{language === "fr" ? "Gamme de prix" : "Price Range"}
								</label>
								<div className="flex flex-wrap gap-1.5">
									{priceCategories.map((opt) => (
										<button
											key={opt.id}
											onClick={() =>
												setPriceRange({
													minPrice: opt.minPrice,
													maxPrice: opt.maxPrice,
												})
											}
											className={cn(
												"text-xs font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
												priceRange.minPrice === opt.minPrice &&
													priceRange.maxPrice === opt.maxPrice
													? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
													: "bg-white text-emerald-800 border-emerald-900/10 hover:bg-emerald-50",
											)}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="space-y-3 pt-6 border-t border-slate-100">
							<Button
								onClick={handleResetFilters}
								variant="outline"
								className="w-full h-11 rounded-xl border-emerald-900/15 text-emerald-800 font-bold"
							>
								{language === "fr" ? "Réinitialiser" : "Clear Filters"}
							</Button>
							<Button
								onClick={() => setMobileFiltersOpen(false)}
								className="w-full h-11 bg-emerald-900 hover:bg-emerald-950 text-white font-bold rounded-xl"
							>
								{language === "fr"
									? `Afficher les résultats (${productPage?.totalElements ?? 0})`
									: `Show Results (${productPage?.totalElements ?? 0})`}
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
