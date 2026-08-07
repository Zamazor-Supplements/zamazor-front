import type { Product } from "@/features/products/schemas/productSchema";

/**
 * Tokenizes and normalizes text into lowercase words.
 */
const tokenize = (str: string): string[] =>
	str
		.toLowerCase()
		.replace(/[^\w\s]/gi, "")
		.split(/\s+/)
		.filter(Boolean);

interface ScoredProduct {
	product: Product;
	score: number;
}

/**
 * Calculates a weighted Jaccard Similarity index between
 * selected preferences and product metadata sets.
 */
export function getRecommendProduct(
	products: Product[],
	userSelections: Record<string, string>,
): Product | undefined {
	if (!products.length) return;

	// Extract non-empty user selected terms and tokenize them
	const activeSelections = Object.values(userSelections).filter(Boolean);
	if (activeSelections.length === 0) return products[0];

	const userTokens = new Set(activeSelections.flatMap(tokenize));

	const scoredProducts: ScoredProduct[] = products.map((product) => {
		// Collect weighted features from the product
		const categoryTokens = new Set(
			tokenize(product.category?.label ?? product.category ?? ""),
		);
		const titleTokens = new Set(tokenize(product.name ?? ""));
		const descTokens = new Set(tokenize(product.description ?? ""));

		// Base Jaccard Calculation
		let matchScore = 0;

		userTokens.forEach((token) => {
			// Category matches carry the highest weight
			if (categoryTokens.has(token)) matchScore += 3.0;
			// Title matches carry moderate weight
			else if (titleTokens.has(token)) matchScore += 1.5;
			// Description matches carry standard weight
			else if (descTokens.has(token)) matchScore += 0.5;
		});

		// Union Set Size for Jaccard Normalization
		const productTokensCount = new Set([
			...categoryTokens,
			...titleTokens,
			...descTokens,
		]).size;

		const unionSize = userTokens.size + productTokensCount;
		// Jaccard Index Formula: Intersection / Union (scaled by matchScore)
		const jaccardScore = unionSize > 0 ? matchScore / unionSize : 0;

		return { product, score: jaccardScore };
	});

	// Sort descending by calculated score
	scoredProducts.sort((a, b) => b.score - a.score);

	return scoredProducts[0]?.product;
}
