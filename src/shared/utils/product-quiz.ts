import type { Product } from "@/features/products/types";

export type QuizTarget = "Protein" | "Greens" | "Energy" | "Recovery" | "Wellness";
export type QuizLanguage = "en" | "fr";

export interface QuizChoice {
	id: QuizTarget;
	labelEn: string;
	labelFr: string;
	descriptionEn: string;
	descriptionFr: string;
}

export interface QuizChoiceState extends QuizChoice {
	productCount: number;
	sampleProduct: Product | null;
}

export const QUIZ_CHOICES: QuizChoice[] = [
	{
		id: "Protein",
		labelEn: "Protein",
		labelFr: "Protéines",
		descriptionEn: "Protein-based picks for strength and daily recovery.",
		descriptionFr: "Des choix riches en protéines pour la force et la récupération quotidienne.",
	},
	{
		id: "Greens",
		labelEn: "Greens",
		labelFr: "Vitamines et minéraux",
		descriptionEn: "Micronutrient support for lighter mornings.",
		descriptionFr: "Un soutien micronutritionnel pour des matins plus légers.",
	},
	{
		id: "Energy",
		labelEn: "Energy",
		labelFr: "Pré-entraînement",
		descriptionEn: "Clean picks for focus, stamina, and training energy.",
		descriptionFr: "Des choix propres pour la concentration et l'énergie à l'entraînement.",
	},
	{
		id: "Recovery",
		labelEn: "Recovery",
		labelFr: "Récupération",
		descriptionEn: "Night-time and post-workout recovery support.",
		descriptionFr: "Un soutien pour la récupération après l'effort et le soir.",
	},
	{
		id: "Wellness",
		labelEn: "Wellness",
		labelFr: "Bien-être",
		descriptionEn: "Everyday wellness products for balance and consistency.",
		descriptionFr: "Des produits de bien-être pour l'équilibre et la régularité.",
	},
];

const CATEGORY_ALIASES: Record<string, QuizTarget> = {
	Proteins: "Protein",
	Protein: "Protein",
	"Vitamins & Minerals": "Greens",
	Greens: "Greens",
	"Pre-Workout & Energy": "Energy",
	Energy: "Energy",
	"Performance & Recovery": "Recovery",
	Recovery: "Recovery",
	"Health & Wellness": "Wellness",
	Wellness: "Wellness",
};

export function resolveQuizTarget(categoryLabel: string | undefined | null): QuizTarget | null {
	if (!categoryLabel) return null;
	return CATEGORY_ALIASES[categoryLabel.trim()] || null;
}

export function getQuizChoiceCopy(choice: QuizChoice, language: QuizLanguage) {
	return {
		label: language === "fr" ? choice.labelFr : choice.labelEn,
		description: language === "fr" ? choice.descriptionFr : choice.descriptionEn,
	};
}

export function buildQuizChoices(products: Product[]): QuizChoiceState[] {
	return QUIZ_CHOICES.map((choice) => {
		const matchingProducts = products.filter((product) => product.category === choice.id);
		return {
			...choice,
			productCount: matchingProducts.length,
			sampleProduct: matchingProducts[0] || null,
		};
	}).filter((choice) => choice.productCount > 0);
}

export function getRecommendedQuizProduct(products: Product[], target: QuizTarget | ""): Product | null {
	if (!target || products.length === 0) return null;
	return products.find((product) => product.category === target) || products[0] || null;
}
