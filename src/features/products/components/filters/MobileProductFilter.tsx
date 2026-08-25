import type { Dispatch, SetStateAction } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { useCategories } from "../../services/category/queries";
import { PRICE_CATEGORIES } from "../../types/filters";
import { useProductFilters } from "../../hooks/use-product-filters";
import { GoalDietPills } from "./GoalDietPills";

interface MobileProductFilterProps {
	totalItems: number;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const MobileProductFilter = ({
	totalItems,
	isOpen,
	setIsOpen,
}: MobileProductFilterProps) => {
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

	if (!isOpen) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Filter options"
			className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
			onClick={(e) => {
				if (e.target === e.currentTarget) setIsOpen(false);
			}}
		>
			<div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-2xl select-none animate-slide-left">
				{/* Modal Header (Sticky) */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
					<div className="flex items-center gap-2">
						<h3 className="font-playfair text-lg font-bold text-slate-900">
							Filters
						</h3>
						{activeFiltersCount > 0 && (
							<span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-900 text-[11px] font-bold text-white">
								{activeFiltersCount}
							</span>
						)}
					</div>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						aria-label="Close filters"
						className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
					>
						<XIcon className="size-5" />
					</button>
				</div>

				{/* Scrollable Filters Body */}
				<div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
					{/* Search Input Mobile */}
					<div className="space-y-2">
						<label
							htmlFor="mobile-search-filter"
							className="text-xs font-black uppercase tracking-wider text-slate-400"
						>
							Search
						</label>
						<div className="relative">
							<SearchIcon
								className="absolute left-3.5 top-3.5 size-4 text-slate-400"
								aria-hidden="true"
							/>
							<Input
								id="mobile-search-filter"
								type="text"
								placeholder="e.g. Protein, Matcha"
								value={filters.query}
								onChange={(e) => handleSearchChange(e.target.value)}
								className="h-11 rounded-lg border-brand-900/10 pl-10 focus-visible:ring-brand-800"
							/>
						</div>
					</div>

					{/* Categories Filter Mobile */}
					<div className="space-y-2.5">
						<span className="text-xs font-black uppercase tracking-wider text-slate-400">
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
											"cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-bold transition-all",
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

					{/* Goal + Dietary pills (shared with the desktop sidebar) */}
					<GoalDietPills
						filters={filters}
						onGoalToggle={handleGoalToggle}
						onDietToggle={handleDietToggle}
					/>

					{/* Price Range Filter Mobile */}
					<div className="space-y-2.5">
						<span className="text-xs font-black uppercase tracking-wider text-slate-400">
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
											"cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-bold transition-all",
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

				{/* Action Buttons Footer (Sticky) */}
				<div className="flex items-center gap-3 border-t border-slate-100 bg-white p-6 shadow-lg">
					<Button
						type="button"
						variant="outline"
						onClick={handleResetFilters}
						disabled={activeFiltersCount === 0}
						className="h-12 flex-1 rounded-lg border-slate-200 font-bold text-slate-700 disabled:opacity-50"
					>
						Clear
					</Button>
					<Button
						type="button"
						onClick={() => setIsOpen(false)}
						className="h-12 flex-2 rounded-lg bg-brand-900 font-bold text-white shadow-md hover:bg-brand-950"
					>
						Show {totalItems} Results
					</Button>
				</div>
			</div>
		</div>
	);
};
