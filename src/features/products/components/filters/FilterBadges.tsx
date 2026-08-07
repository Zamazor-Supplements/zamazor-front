import type { Dispatch, SetStateAction } from "react";
import { initialFilters, type Filters } from "../../types/filters";
import type { Category } from "../../schemas/categorySchema";
import { XIcon } from "lucide-react";
import { formatCurrency } from "@/shared/utils/price";

interface FilterBadgesProps {
	filters: Filters;
	setFilters: Dispatch<SetStateAction<Filters>>;
	selectedCategory: Category | undefined;
}

export const FilterBadges = ({
	filters,
	setFilters,
	selectedCategory,
}: FilterBadgesProps) => {
	const hasQuery = Boolean(filters.query?.trim());
	const hasCategory = Boolean(filters.categoryId);
	const hasPrice = filters.price !== initialFilters.price;

	const hasActiveFilters = hasQuery || hasCategory || hasPrice;

	if (!hasActiveFilters) return null;

	const resetQuery = () => {
		setFilters((prev) => ({ ...prev, query: initialFilters.query }));
	};

	const removeCategory = () => {
		setFilters((prev) => ({ ...prev, categoryId: initialFilters.categoryId }));
	};

	const removePrice = () => {
		setFilters((prev) => ({ ...prev, price: initialFilters.price }));
	};

	const renderPriceLabel = () => {
		const min = filters.price?.min;
		const max = filters.price?.max;

		if (!min && max) return `Under ${formatCurrency(max)}`;
		if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
		if (min && !max) return `Over ${formatCurrency(min)}`;

		return "Custom price";
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-400">
				Active filters:
			</span>

			{/* Query Badge */}
			{hasQuery && (
				<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
					<span>"{filters.query}"</span>
					<button
						type="button"
						onClick={resetQuery}
						aria-label="Remove search filter"
						className="rounded-full p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none"
					>
						<XIcon className="size-3" />
					</button>
				</span>
			)}

			{/* Category Badge */}
			{selectedCategory && (
				<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
					<span>{selectedCategory.label}</span>
					<button
						type="button"
						onClick={removeCategory}
						aria-label="Remove category filter"
						className="rounded-full p-0.5 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 focus:outline-none"
					>
						<XIcon className="size-3" />
					</button>
				</span>
			)}

			{/* Price Badge */}
			{hasPrice && (
				<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
					<span>{renderPriceLabel()}</span>
					<button
						type="button"
						onClick={removePrice}
						aria-label="Remove price filter"
						className="rounded-full p-0.5 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 focus:outline-none"
					>
						<XIcon className="size-3" />
					</button>
				</span>
			)}
		</div>
	);
};
