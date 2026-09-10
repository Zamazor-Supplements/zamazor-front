import { Button } from "@/shared/components/ui/button";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontalIcon } from "lucide-react";
import { ProductCardSkeleton } from "../skeleton/ProductCardSkeleton";
import type { Filters, Paginations } from "../../types/filters";
import type { ProductPage } from "../../schemas/productSchema";

interface ProductGridProps {
	productPage: ProductPage | undefined;
	isPending: boolean;
	filters: Filters;
	paginations: Paginations;
	handleResetFilters: () => void;
}

export const ProductGrid = ({
	productPage,
	isPending,
	paginations,
	handleResetFilters,
}: ProductGridProps) => {
	const products = productPage?.items ?? [];

	// Loading State
	if (isPending) {
		return (
			<div
				aria-busy="true"
				aria-label="Loading products..."
				className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
			>
				{Array.from({ length: paginations.size ?? 6 }).map((_, i) => (
					<ProductCardSkeleton key={i} />
				))}
			</div>
		);
	}

	// Empty State
	if (products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-3xl border border-brand-900/5 bg-white px-6 py-20 text-center shadow-sm">
				<SlidersHorizontalIcon className="mb-4 size-16 text-brand-900/25" />
				<h3 className="font-playfair text-xl font-bold text-slate-900">
					No supplement blends found
				</h3>
				<p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
					We couldn't find any clean supplements matching your filters. Try
					checking different categories or search queries.
				</p>
				<Button
					onClick={handleResetFilters}
					className="mt-6 h-11 cursor-pointer rounded-lg bg-brand-900 px-6 font-bold text-white hover:bg-brand-950 transition-colors"
				>
					Reset filters
				</Button>
			</div>
		);
	}

	// Active Grid State
	return (
		<div
			aria-live="polite"
			className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
		>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};
