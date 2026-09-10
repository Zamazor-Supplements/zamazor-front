import type { Dispatch, SetStateAction } from "react";
import { initialFilters, type Filters } from "../../types/filters";
import { DIETS, GOALS } from "../../config/goalMapping";
import type { Category } from "../../schemas/categorySchema";
import { XIcon } from "lucide-react";
import { formatPrice } from "@/shared/utils/price";
import { useLanguage } from "@/shared/hooks/use-language";

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
	const { t } = useLanguage();

	const hasQuery = Boolean(filters.query?.trim());
	const hasGoal = Boolean(filters.goal);
	const hasCategory = Boolean(filters.categoryId) && !hasGoal;
	const hasDiet = Boolean(filters.diet);
	const hasPrice = filters.price !== initialFilters.price;

	const hasActiveFilters =
		hasQuery || hasCategory || hasPrice || hasGoal || hasDiet;

	if (!hasActiveFilters) return null;

	const goalOption = GOALS.find((g) => g.id === filters.goal);
	const dietOption = DIETS.find((d) => d.id === filters.diet);

	const resetQuery = () => {
		setFilters((prev) => ({ ...prev, query: initialFilters.query }));
	};

	const removeCategory = () => {
		setFilters((prev) => ({
			...prev,
			categoryId: initialFilters.categoryId,
		}));
	};

	const removeGoal = () => {
		// Goals drive categoryId; clearing one clears the other too.
		setFilters((prev) => ({
			...prev,
			goal: initialFilters.goal,
			categoryId: initialFilters.categoryId,
		}));
	};

	const removeDiet = () => {
		setFilters((prev) => ({ ...prev, diet: initialFilters.diet }));
	};

	const removePrice = () => {
		setFilters((prev) => ({ ...prev, price: initialFilters.price }));
	};

	const renderPriceLabel = () => {
		const min = filters.price?.min;
		const max = filters.price?.max;

		if (!min && max) return `Under ${formatPrice(max)}`;
		if (min && max) return `${formatPrice(min)} - ${formatPrice(max)}`;
		if (min && !max) return `Over ${formatPrice(min)}`;

		return "Custom price";
	};

	const renderBadge = (
		label: string,
		color: "slate" | "emerald",
		onRemove: () => void,
		ariaLabel: string,
	) => (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
				color === "emerald"
					? "border-brand-900/10 bg-brand-50 text-brand-900"
					: "border-slate-200 bg-slate-100 text-slate-800"
			}`}
		>
			<span>{label}</span>
			<button
				type="button"
				onClick={onRemove}
				aria-label={ariaLabel}
				className={`rounded-full p-0.5 focus:outline-none ${
					color === "emerald"
						? "text-brand-700 hover:bg-brand-100 hover:text-brand-900"
						: "text-slate-500 hover:bg-slate-200 hover:text-slate-800"
				}`}
			>
				<XIcon className="size-3" />
			</button>
		</span>
	);

	return (
		<div className="flex flex-wrap items-center gap-2">
			<span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-400">
				Active filters:
			</span>

			{/* Query Badge */}
			{hasQuery &&
				renderBadge(
					`"${filters.query}"`,
					"slate",
					resetQuery,
					"Remove search filter",
				)}

			{/* Goal Badge */}
			{hasGoal &&
				goalOption &&
				renderBadge(t(goalOption.labelKey), "emerald", removeGoal, "Remove goal filter")}

			{/* Category Badge (hidden while a goal drives the category) */}
			{hasCategory &&
				selectedCategory &&
				renderBadge(
					selectedCategory.label,
					"emerald",
					removeCategory,
					"Remove category filter",
				)}

			{/* Dietary Badge */}
			{hasDiet &&
				dietOption &&
				renderBadge(t(dietOption.labelKey), "emerald", removeDiet, "Remove dietary filter")}

			{/* Price Badge */}
			{hasPrice &&
				renderBadge(renderPriceLabel(), "emerald", removePrice, "Remove price filter")}
		</div>
	);
};
