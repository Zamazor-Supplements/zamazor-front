export const formatCurrency = (
	amount: number,
	locale = "fr-MA",
	currency = "MAD",
) => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		notation: "compact",
		compactDisplay: "short",
		currencyDisplay: "code",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
};

interface FormatPriceOptions {
	/** Use compact notation (e.g. "1,2 k DH") for dashboard metric cards. Defaults to exact amounts. */
	compact?: boolean;
}

/** Exact-price formatter for storefront surfaces (PDP, cart, checkout). */
export const formatPrice = (
	amount: number,
	options: FormatPriceOptions = {},
) => {
	const { compact = false } = options;
	return new Intl.NumberFormat("fr-MA", {
		style: "currency",
		currency: "MAD",
		currencyDisplay: "narrowSymbol",
		notation: compact ? "compact" : "standard",
		compactDisplay: "short",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
};
