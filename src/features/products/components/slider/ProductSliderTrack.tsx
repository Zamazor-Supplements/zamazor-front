import type { ProductPage } from "../../schemas/productSchema";
import { AnimatePresence, motion } from "framer-motion";
import { SliderSkeleton } from "../skeleton/SliderSkeleton";
import { SliderErrorFallback } from "./SliderErrorFallback";
import { ProductCard } from "../product/ProductCard";

interface ProductSliderTrackProps {
	sliderRef: (node: HTMLDivElement | null) => void;
	productPage: ProductPage | undefined;
	isPending: boolean;
	isError: boolean;
	refetch: () => void;
	activeCategoryId: string | undefined;
}

export const ProductSliderTrack = ({
	sliderRef,
	productPage,
	isPending,
	isError,
	refetch,
	activeCategoryId,
}: ProductSliderTrackProps) => {
	const hasItems = Boolean(productPage?.items && productPage.items.length > 0);

	return (
		<div
			ref={sliderRef}
			role="region"
			aria-label="Products slider"
			className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] min-h-100"
		>
			<AnimatePresence mode="wait">
				{isPending ? (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="w-full"
					>
						<SliderSkeleton />
					</motion.div>
				) : isError ? (
					<div key="error" className="w-full">
						<SliderErrorFallback
							title="Unable to load products"
							description="We encountered an issue while fetching items. Please try again."
							onRetry={refetch}
						/>
					</div>
				) : !hasItems ? (
					<div key="empty" className="w-full">
						<SliderErrorFallback
							title="No products available"
							description="There are no items currently assigned here. Check back soon."
							onRetry={refetch}
						/>
					</div>
				) : (
					<motion.div
						key={activeCategoryId ?? "all"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex gap-6"
					>
						{productPage?.items.map((product) => (
							<div
								key={product.id}
								className="snap-start shrink-0 w-70 sm:w-[320px]"
							>
								<ProductCard product={product} />
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
