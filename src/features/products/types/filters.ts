interface PriceRange {
	min: undefined | number;
	max: undefined | number;
}

export interface Filters {
	price: PriceRange | undefined;
	query: string | undefined;
	categoryId: string | undefined;
}

export type Sort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "name,asc"
	| "name,desc"
	| "price,asc"
	| "price,desc";

export interface Paginations {
	page: number;
	size: number;
	sort: Sort;
}

export const ITEMS_PER_PAGE = 6;

export const initialPaginations = {
	page: 0,
	size: ITEMS_PER_PAGE,
	sort: "name,asc",
} satisfies Paginations;

export const initialFilters = {
	price: undefined,
	query: undefined,
	categoryId: undefined,
} satisfies Filters;

export const PRICE_CATEGORIES = [
	{
		id: "all",
		label: "All Prices",
		minPrice: undefined,
		maxPrice: undefined,
	},
	{
		id: "under-25",
		label: "Under 25 MAD",
		minPrice: undefined,
		maxPrice: 25,
	},
	{
		id: "25-40",
		label: "25 to 40 MAD",
		minPrice: 25,
		maxPrice: 40,
	},
	{
		id: "over-40",
		label: "Over 40 MAD",
		minPrice: 40,
		maxPrice: undefined,
	},
];
