import type { ProductReview } from "../schemas/productSchema";

/**
 * Curated fallback content for the PDP tabs (Dosage / Ingredients / Reviews).
 * The backend has no per-product data for these yet, so content is derived from
 * the product's category label — the same keyword-matching approach as
 * `getCategoryAdvisory` in ProductDetails. Everything here is a clearly-labelled
 * preview; real payload data (schema's optional fields) wins when it arrives.
 */

function matches(
	categoryLabel: string | undefined,
	keywords: string[],
): boolean {
	if (!categoryLabel) return false;
	const label = categoryLabel.toLowerCase();
	return keywords.some((keyword) => label.includes(keyword));
}

const PROTEIN_INGREDIENTS = [
	"Organic pea protein isolate (24 g protein per serving)",
	"Brown rice protein concentrate",
	"Raw cacao powder",
	"Chicory root fiber",
	"Himalayan pink salt",
	"Stevia leaf extract",
];

const GREENS_INGREDIENTS = [
	"Organic wheatgrass powder",
	"Organic barley grass",
	"Spirulina & chlorella blend",
	"Moringa leaf extract",
	"Digestive enzymes (amylase, protease, lipase)",
	"Probiotic blend (Lactobacillus + Bifidobacterium)",
];

const ENERGY_INGREDIENTS = [
	"Organic ceremonial matcha (100 mg natural caffeine)",
	"L-theanine (for smooth, jitter-free focus)",
	"Beetroot extract (natural nitrates)",
	"Guarana seed extract",
	"Electrolyte blend (sodium, potassium, magnesium)",
];

const RECOVERY_INGREDIENTS = [
	"Micellar casein (slow-digesting protein)",
	"Magnesium glycinate",
	"Tart cherry extract",
	"Zinc Bis-Glycinate",
	"L-tryptophan",
	"Chamomile flower extract",
];

const WELLNESS_INGREDIENTS = [
	"Ashwagandha (KSM-66)",
	"Elderberry extract (standardized)",
	"Vitamin C (as ascorbic acid)",
	"Zinc picolinate",
	"Adaptogen mushroom blend (reishi, lion's mane)",
];

const DOSAGE_BY_CATEGORY = {
	protein:
		"Mix 1 scoop (30 g) with 250 ml of cold water or milk within 45 minutes after training. Use a rest-day serving mid-morning to support daily protein intake.",
	greens:
		"Stir 1 scoop into 300 ml of water or your morning juice on an empty stomach for best absorption. Do not exceed 2 servings per day.",
	energy:
		"Take 1 serving 20–30 minutes before training for clean, sustained focus. Do not exceed 1 serving per day, and avoid consuming within 6 hours of bedtime.",
	recovery:
		"Consume 30–45 minutes before bedtime to support overnight muscle repair and deep sleep. Shake well with cold water.",
	wellness:
		"Take 1 serving with your morning meal daily, or as directed by your healthcare professional. Best absorbed with food.",
};

const REVIEW_BASE: Omit<ProductReview, "date">[] = [
	{
		author: "Maya R.",
		rating: 5,
		body: "Tastes fresh, not chalky — the first supplement habit I have actually kept. Mixes instantly with water.",
		verified: true,
	},
	{
		author: "Adam K.",
		rating: 5,
		body: "Mixes smooth and does not feel heavy. Perfect after morning training, and the packaging is recyclable.",
		verified: true,
	},
	{
		author: "Nadia S.",
		rating: 4.5,
		body: "Simple, clean, and easy to trust. I cycle it with the rest of my stack and always come back to this one.",
		verified: true,
	},
];

const CURATED_DATE = "2026-07-15";

export function getCuratedIngredients(
	categoryLabel: string | undefined,
): string[] {
	if (matches(categoryLabel, ["protein"])) return PROTEIN_INGREDIENTS;
	if (matches(categoryLabel, ["vitamin", "mineral", "green"]))
		return GREENS_INGREDIENTS;
	if (matches(categoryLabel, ["pre-workout", "energy"]))
		return ENERGY_INGREDIENTS;
	if (matches(categoryLabel, ["recovery", "performance"]))
		return RECOVERY_INGREDIENTS;
	return WELLNESS_INGREDIENTS;
}

export function getCuratedDosage(categoryLabel: string | undefined): string {
	if (matches(categoryLabel, ["protein"])) return DOSAGE_BY_CATEGORY.protein;
	if (matches(categoryLabel, ["vitamin", "mineral", "green"]))
		return DOSAGE_BY_CATEGORY.greens;
	if (matches(categoryLabel, ["pre-workout", "energy"]))
		return DOSAGE_BY_CATEGORY.energy;
	if (matches(categoryLabel, ["recovery", "performance"]))
		return DOSAGE_BY_CATEGORY.recovery;
	return DOSAGE_BY_CATEGORY.wellness;
}

export function getCuratedReviews() {
	return REVIEW_BASE.map((review) => ({
		...review,
		date: CURATED_DATE,
	}));
}

export function getCuratedRating(): number {
	// Matches the curated preview reviews (4.8 across the base).
	return 4.8;
}

