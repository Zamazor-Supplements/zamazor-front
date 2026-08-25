import { RotateCcwIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { useCategories } from "../../services/category/queries";
import { PRICE_CATEGORIES } from "../../types/filters";
import { useProductFilters } from "../../hooks/use-product-filters";
import { GoalDietPills } from "./GoalDietPills";

export const ProductFilter = () => {
	const { data: categories } = useCategories();
	const {
		filters,
		handleSearchChange,
		handleCategoryToggle,
		handlePriceToggle,
		handleGoalToggle,
		handleDietToggle,
		handleResetFilters,
		activeFiltersCount,
	} = useProductFilters();

	return (
		<aside
			aria-label="Filters"
			className="hidden lg:block w-full shrink-0 select-none"
		>
			<div className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col rounded-xl border border-slate-200/70 bg-white/95 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl transition-all">
				{/* Modern Header with Glassy Counter Accent */}
				<div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-4">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-900 shadow-xs">
							<SlidersHorizontalIcon className="size-4" />
						</div>
						<h3 className="font-playfair text-base font-bold tracking-tight text-slate-900">
							Filters
						</h3>
						{activeFiltersCount > 0 && (
							<span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-brand-900 text-[10px] font-extrabold text-white shadow-xs">
								{activeFiltersCount}
							</span>
						)}
					</div>
					<button
						type="button"
						onClick={handleResetFilters}
						disabled={activeFiltersCount === 0}
						className="group flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-400 transition-colors hover:text-brand-900 focus:outline-hidden disabled:opacity-30 disabled:cursor-not-allowed"
					>
						<span>Reset</span>
						<RotateCcwIcon className="size-3 transition-transform group-hover:-rotate-45" />
					</button>
				</div>

				{/* Scrollable Filters Content Area */}
				<div className="mt-5 flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin [scrollbar-color:var(--color-slate-200)_transparent]">
					{/* Modern Floating Search Box */}
					<div className="space-y-2">
						<label
							htmlFor="desktop-search-filter"
							className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400"
						>
							Search Catalog
						</label>
						<div className="group relative">
							<SearchIcon
								className="absolute left-3.5 top-3.5 size-4 text-slate-400 transition-colors group-focus-within:text-brand-800"
								aria-hidden="true"
							/>
							<Input
								id="desktop-search-filter"
								type="text"
								placeholder="e.g. Protein, Matcha"
								value={filters.query}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="h-10 rounded-lg border-slate-200/80 bg-slate-50/50 pl-10 text-xs transition-all placeholder:text-slate-400 focus-visible:border-brand-800 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-900/10"
							/>
						</div>
					</div>

					<div className="h-px bg-slate-100" />

					{/* Unified Pill Grid for Categories */}
					<div className="space-y-2.5">
						<span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
							Category
						</span>
						<div className="flex flex-wrap gap-2">
							{categories?.map((cat) => {
								const isSelected = filters.categoryId === cat.id;

								return (
									<button
										key={cat.id}
										type="button"
										aria-pressed={isSelected}
										onClick={() => handleCategoryToggle(cat.id)}
										className={cn(
											"cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-bold transition-all active:scale-95",
											isSelected
												? "border-brand-900 bg-brand-900 text-white shadow-xs"
												: "border-slate-200 bg-white text-slate-700 hover:border-brand-900/30 hover:bg-brand-50/50",
										)}
									>
										{cat.label}
									</button>
								);
							})}
						</div>
					</div>

					<div className="h-px bg-slate-100" />

					{/* Goal + Dietary pills */}
					<GoalDietPills
						filters={filters}
						onGoalToggle={handleGoalToggle}
						onDietToggle={handleDietToggle}
					/>

					<div className="h-px bg-slate-100" />

					{/* Price Range Section */}
					<div className="space-y-2.5">
						<span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
							Price Range
						</span>
						<div className="flex flex-wrap gap-2">
							{PRICE_CATEGORIES.map((opt) => {
								const isSelected =
									filters.price?.min === opt.minPrice &&
									filters.price?.max === opt.maxPrice;

								return (
									<button
										key={opt.id}
										type="button"
										aria-pressed={isSelected}
										onClick={() =>
											handlePriceToggle(opt.minPrice, opt.maxPrice)
										}
										className={cn(
											"cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-bold transition-all active:scale-95",
											isSelected
												? "border-brand-900 bg-brand-900 text-white shadow-xs"
												: "border-slate-200 bg-white text-slate-700 hover:border-brand-900/30 hover:bg-brand-50/50",
										)}
									>
										{opt.label}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
};
