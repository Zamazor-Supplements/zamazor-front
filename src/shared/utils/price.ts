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
