import type { QuizFocus } from "@/features/supplement-match/types/quiz";

/**
 * Goal → category mapping. Goals mirror the supplement-match quiz focuses
 * (single source of truth for labels); each goal resolves to the real
 * `categoryId` filter via label keywords. Dietary chips are visual-only —
 * the backend has no tag data — so they are never turned into query params.
 */

export type GoalId = Exclude<QuizFocus, "">;

export type QuizDiet = "vegan" | "organic" | "keto" | "glutenFree";

export interface GoalOption {
	id: GoalId;
	/** i18n key, e.g. "shop.goalPerformance". */
	labelKey: string;
	/** Category-label keywords (case-insensitive) used to resolve the goal's category. */
	categoryKeywords: string[];
}

export const GOALS: GoalOption[] = [
	{
		id: "performance",
		labelKey: "shop.goalPerformance",
		categoryKeywords: ["protein"],
	},
	{
		id: "greens",
		labelKey: "shop.goalGreens",
		categoryKeywords: ["vitamins", "minerals", "greens"],
	},
	{
		id: "energy",
		labelKey: "shop.goalEnergy",
		categoryKeywords: ["pre-workout", "energy"],
	},
	{
		id: "recovery",
		labelKey: "shop.goalRecovery",
		categoryKeywords: ["recovery", "performance"],
	},
	{
		id: "wellness",
		labelKey: "shop.goalWellness",
		categoryKeywords: ["wellness", "health"],
	},
];

export interface DietOption {
	id: QuizDiet;
	/** i18n key, e.g. "shop.dietVegan". */
	labelKey: string;
}

export const DIETS: DietOption[] = [
	{ id: "vegan", labelKey: "shop.dietVegan" },
	{ id: "organic", labelKey: "shop.dietOrganic" },
	{ id: "keto", labelKey: "shop.dietKeto" },
	{ id: "glutenFree", labelKey: "shop.dietGlutenFree" },
];
