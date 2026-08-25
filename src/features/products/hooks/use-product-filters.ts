import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	type SetStateAction,
} from "react";
import { useSearchParams } from "react-router";
import { useCategories } from "../services/category/queries";
import {
	DIETS,
	GOALS,
	type GoalId,
	type QuizDiet,
} from "../config/goalMapping";
import {
	initialFilters,
	type Filters,
	type PriceRange,
} from "../types/filters";

const PRICE_MIN_KEY = "minPrice";
const PRICE_MAX_KEY = "maxPrice";

function isGoalId(value: string | null): value is GoalId {
	return value !== null && GOALS.some((g) => g.id === value);
}

function isQuizDiet(value: string | null): value is QuizDiet {
	return value !== null && DIETS.some((d) => d.id === value);
}

function readPriceRange(params: URLSearchParams): PriceRange | undefined {
	const minRaw = params.get(PRICE_MIN_KEY);
	const maxRaw = params.get(PRICE_MAX_KEY);
	// Guard against NaN from garbage URL values so they never leak into the
	// filter state or the API query.
	const min = minRaw ? Number(minRaw) : undefined;
	const max = maxRaw ? Number(maxRaw) : undefined;
	const validMin = typeof min === "number" && Number.isFinite(min) ? min : undefined;
	const validMax = typeof max === "number" && Number.isFinite(max) ? max : undefined;
	return validMin === undefined && validMax === undefined
		? undefined
		: { min: validMin, max: validMax };
}

function readFilters(params: URLSearchParams): Filters {
	const goalParam = params.get("goal");
	const dietParam = params.get("diet");

	return {
		query: params.get("search") ?? undefined,
		categoryId: params.get("category") ?? undefined,
		goal: isGoalId(goalParam) ? goalParam : undefined,
		diet: isQuizDiet(dietParam) ? dietParam : undefined,
		price: readPriceRange(params),
	};
}

/**
 * Single source of truth for the shop filter state. Reads initial values from
 * the URL (?search=, ?category=, ?goal=, ?diet=, ?minPrice=, ?maxPrice=) and
 * writes changes back via replace, so deep links and back/forward both work.
 * Goal pills resolve to the real categoryId filter (client-side mapping).
 */
export function useProductFilters() {
	const { data: categories } = useCategories();
	const [searchParams, setSearchParams] = useSearchParams();

	const filters = useMemo(() => readFilters(searchParams), [searchParams]);

	// Keep a ref so functional setFilters updates never read stale state.
	const filtersRef = useRef(filters);
	useEffect(() => {
		filtersRef.current = filters;
	}, [filters]);

	const updateFilters = useCallback(
		(next: Filters) => {
			const params = new URLSearchParams(searchParams);

			const setOrDelete = (key: string, value: string | undefined) => {
				if (value) params.set(key, value);
				else params.delete(key);
			};

			setOrDelete("search", next.query);
			setOrDelete("category", next.categoryId);
			setOrDelete("goal", next.goal);
			setOrDelete("diet", next.diet);

			if (next.price) {
				if (next.price.min !== undefined) {
					params.set(PRICE_MIN_KEY, String(next.price.min));
				} else {
					params.delete(PRICE_MIN_KEY);
				}
				if (next.price.max !== undefined) {
					params.set(PRICE_MAX_KEY, String(next.price.max));
				} else {
					params.delete(PRICE_MAX_KEY);
				}
			} else {
				params.delete(PRICE_MIN_KEY);
				params.delete(PRICE_MAX_KEY);
			}

			setSearchParams(params, { replace: true });
		},
		[searchParams, setSearchParams],
	);

	const setFilters = useCallback(
		(action: SetStateAction<Filters>) => {
			const prev = filtersRef.current;
			const next =
				typeof action === "function" ? action(prev) : action;
			updateFilters(next);
		},
		[updateFilters],
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			setFilters((prev) => ({ ...prev, query: value }));
		},
		[setFilters],
	);

	const handleCategoryToggle = useCallback(
		(catId: string) => {
			setFilters((prev) => {
				const isActive = prev.categoryId === catId;
				return {
					...prev,
					categoryId: isActive ? initialFilters.categoryId : catId,
					// Category and goal pills are alternatives: picking a category
					// clears the goal so the manual pick isn't overridden by the
					// goal mapping.
					goal: isActive ? prev.goal : initialFilters.goal,
				};
			});
		},
		[setFilters],
	);

	const handlePriceToggle = useCallback(
		(minPrice?: number, maxPrice?: number) => {
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
		},
		[setFilters],
	);

	/** Goal pills and category pills are alternatives: picking a goal clears category. */
	const handleGoalToggle = useCallback(
		(goal: GoalId) => {
			setFilters((prev) => {
				const isActive = prev.goal === goal;
				return {
					...prev,
					goal: isActive ? undefined : goal,
					categoryId: isActive ? prev.categoryId : initialFilters.categoryId,
				};
			});
		},
		[setFilters],
	);

	/** Dietary chips are visual-only (aria-pressed); they never touch the query. */
	const handleDietToggle = useCallback(
		(diet: QuizDiet) => {
			setFilters((prev) => ({
				...prev,
				diet: prev.diet === diet ? undefined : diet,
			}));
		},
		[setFilters],
	);

	const handleResetFilters = useCallback(() => {
		updateFilters(initialFilters);
	}, [updateFilters]);

	/** Effective categoryId sent to the API: goal mapping wins over a manual pick. */
	const goalCategoryId = useMemo(() => {
		if (!filters.goal) return undefined;
		const option = GOALS.find((g) => g.id === filters.goal);
		if (!option) return undefined;
		return categories?.find((c) =>
			option.categoryKeywords.some((kw) =>
				c.label.toLowerCase().includes(kw),
			),
		)?.id;
	}, [categories, filters.goal]);

	const activeFiltersCount =
		(filters.query ? 1 : 0) +
		(filters.price !== undefined ? 1 : 0) +
		(filters.goal ? 1 : 0) +
		(filters.diet ? 1 : 0) +
		(filters.categoryId !== undefined && !filters.goal ? 1 : 0);

	return {
		filters,
		setFilters,
		handleSearchChange,
		handleCategoryToggle,
		handlePriceToggle,
		handleGoalToggle,
		handleDietToggle,
		handleResetFilters,
		activeFiltersCount,
		goalCategoryId,
	};
}
