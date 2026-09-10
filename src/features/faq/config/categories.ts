export const FAQ_CATEGORIES = [
	"All",
	"Orders",
	"Shipping",
	"Products",
	"Returns",
] as const;
export type FAQCategory = (typeof FAQ_CATEGORIES)[number];
