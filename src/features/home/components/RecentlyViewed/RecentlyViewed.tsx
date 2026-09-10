import { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon, HistoryIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/features/products/components/product/ProductCard";
import { useBulkProducts } from "@/features/products/services/product/queries";
import { useScrollControls } from "@/shared/hooks/use-scroll-controllers";
import { useRecentlyViewedIds } from "@/shared/hooks/use-recently-viewed";
import { Button } from "@/shared/components/ui/button";
import { CARD_ANIMATION } from "@/shared/config/motion";
import { SliderSkeleton } from "@/features/products/components/skeleton/SliderSkeleton";
import type { Product } from "@/features/products/schemas/productSchema";

/**
 * Homepage "Recently viewed" rail. Pulls the persisted browse history from
 * localStorage and renders the products in recency order. Hidden entirely
 * until the user has viewed at least one product.
 */
export const RecentlyViewed = () => {
	const ids = useRecentlyViewedIds();
	const { data: products, isPending } = useBulkProducts(ids);

	const recentlyViewed = useMemo(() => {
		if (!products) return [];
		const byId = new Map(products.map((product) => [product.id, product]));
		return ids
			.map((id) => byId.get(id))
			.filter((product): product is Product => Boolean(product));
	}, [products, ids]);

	const { sliderRef, canScrollLeft, canScrollRight, scroll } =
		useScrollControls({
			scrollRatio: 0.75,
		});

	if (ids.length === 0) return null;

	return (
		<section
			aria-label="Recently viewed products"
			className="bg-white py-16 border-b border-brand-900/10"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header & Controls */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
					<div className="flex-1">
						<p className="text-xs font-black uppercase tracking-widest text-brand-700 flex items-center gap-1.5">
							<HistoryIcon className="size-3.5" />
							Recently viewed
						</p>
						<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950 sm:text-4xl">
							Pick up where you left off.
						</h2>
						<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
							Products you explored recently, ready to revisit whenever you are.
						</p>
					</div>

					<div className="flex items-center gap-1.5 self-start sm:self-end">
						<Button
							variant="outline"
							size="icon"
							disabled={!canScrollLeft || isPending}
							className="size-9 rounded-lg border-brand-900/10 text-brand-800 hover:bg-brand-50 hover:text-brand-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
							onClick={() => scroll("left")}
							aria-label="Scroll left"
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							disabled={!canScrollRight || isPending}
							className="size-9 rounded-lg border-brand-900/10 text-brand-800 hover:bg-brand-50 hover:text-brand-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
							onClick={() => scroll("right")}
							aria-label="Scroll right"
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</div>

				{/* Content Container */}
				{isPending && recentlyViewed.length === 0 ? (
					<SliderSkeleton />
				) : (
					<motion.div
						{...CARD_ANIMATION}
						ref={sliderRef}
						role="region"
						aria-label="Recently viewed product carousel"
						className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
					>
						{recentlyViewed.map((product) => (
							<div
								key={product.id}
								className="snap-start shrink-0 w-70 sm:w-[320px]"
							>
								<ProductCard product={product} />
							</div>
						))}
					</motion.div>
				)}
			</div>
		</section>
	);
};
