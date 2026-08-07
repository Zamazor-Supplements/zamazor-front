import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
	initialFilters,
	PRICE_CATEGORIES,
	type Filters,
} from "../../types/filters";
import { useCategories } from "../../services/category/queries";
import {
	CheckIcon,
	RotateCcwIcon,
	SearchIcon,
	SlidersHorizontalIcon,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";

interface FiltersProps {
	filters: Filters;
	setFilters: Dispatch<SetStateAction<Filters>>;
	handleResetFilters: () => void;
}

export const ProductFilter = ({
	filters,
	setFilters,
	handleResetFilters,
}: FiltersProps) => {
	const { data: categories } = useCategories();

	const activeFiltersCount =
		(filters.query ? 1 : 0) +
		(filters.categoryId !== initialFilters.categoryId ? 1 : 0) +
		(filters.price !== initialFilters.price ? 1 : 0);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFilters((prev) => ({
			...prev,
			query: e.target.value,
		}));
	};

	const handleCategoryToggle = (catId: string) => {
		setFilters((prev) => ({
			...prev,
			categoryId: prev.categoryId === catId ? initialFilters.categoryId : catId,
		}));
	};

	const handlePriceToggle = (minPrice?: number, maxPrice?: number) => {
		setFilters((prev) => {
			const isSelected =
				prev.price?.min === minPrice && prev.price?.max === maxPrice;

			return {
				...prev,
				price:
					isSelected || (!minPrice && !maxPrice)
						? initialFilters.price
						: { min: minPrice, max: maxPrice },
			};
		});
	};

	return (
		<aside
			aria-label="Filters"
			className="hidden lg:block w-72 shrink-0 select-none"
		>
			<div className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all">
				{/* Modern Header with Glassy Counter Accent */}
				<div className="flex shrink-0 items-center justify-between border-b border-slate-100/80 pb-5">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
							<SlidersHorizontalIcon className="size-4" />
						</div>
						<h3 className="font-playfair text-base font-bold tracking-tight text-slate-900">
							Filters
						</h3>
						{activeFiltersCount > 0 && (
							<span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-emerald-900 text-[10px] font-extrabold text-white shadow-xs animate-scale-in">
								{activeFiltersCount}
							</span>
						)}
					</div>
					<button
						type="button"
						onClick={handleResetFilters}
						disabled={activeFiltersCount === 0}
						className="group flex items-center gap-1 cursor-pointer text-xs font-bold text-slate-400 transition-colors hover:text-emerald-900 focus:outline-hidden disabled:opacity-30 disabled:cursor-not-allowed"
					>
						<span>Reset</span>
						<RotateCcwIcon className="size-3 transition-transform group-hover:-rotate-45" />
					</button>
				</div>

				{/* Scrollable Filters Content Area */}
				<div className="mt-6 flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-thin [scrollbar-color:var(--color-slate-200)_transparent]">
					{/* Modern Floating Search Box */}
					<div className="space-y-2.5">
						<label
							htmlFor="desktop-search-filter"
							className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400"
						>
							Search Catalog
						</label>
						<div className="group relative">
							<SearchIcon
								className="absolute left-3.5 top-3.5 size-4 text-slate-400 transition-colors group-focus-within:text-emerald-800"
								aria-hidden="true"
							/>
							<Input
								id="desktop-search-filter"
								type="text"
								placeholder="e.g. Protein, Matcha"
								value={filters.query}
								onChange={handleSearchChange}
								className="h-11 rounded-2xl border-slate-200/80 bg-slate-50/50 pl-10 text-sm transition-all placeholder:text-slate-400 focus-visible:border-emerald-800 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-900/10"
							/>
						</div>
					</div>

					{/* Modern Pill Grid for Categories */}
					<div className="space-y-3">
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
											"group relative flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200",
											isSelected
												? "bg-emerald-900 text-white shadow-md shadow-emerald-900/20 scale-[1.02]"
												: "border border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-emerald-800/30 hover:bg-emerald-50/30 hover:text-emerald-900",
										)}
									>
										<span>{cat.label}</span>
										{isSelected && (
											<CheckIcon
												className="size-3.5 text-emerald-200 animate-scale-in"
												aria-hidden="true"
											/>
										)}
									</button>
								);
							})}
						</div>
					</div>

					{/* Modern Card Stack for Price Ranges */}
					<div className="space-y-3">
						<span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
							Price Range
						</span>
						<div className="grid grid-cols-1 gap-2">
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
											"group flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs font-bold transition-all duration-200",
											isSelected
												? "border-emerald-900 bg-emerald-900/5 text-emerald-950 shadow-xs ring-1 ring-emerald-900/20"
												: "border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-emerald-800/30 hover:bg-emerald-50/30 hover:text-slate-900",
										)}
									>
										<span className="tracking-wide">{opt.label}</span>
										<div
											className={cn(
												"flex size-5 items-center justify-center rounded-full border transition-all",
												isSelected
													? "border-emerald-900 bg-emerald-900 text-white"
													: "border-slate-300 bg-white group-hover:border-emerald-800",
											)}
										>
											{isSelected && (
												<CheckIcon className="size-3" aria-hidden="true" />
											)}
										</div>
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
