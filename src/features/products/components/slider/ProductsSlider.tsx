import { APP_ROUTES } from "@/app/routes/paths";
import { ProductCard } from "@/features/products/components/product/ProductCard";
import { Button } from "@/shared/components/ui/button";
import {
	ArrowRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useProducts } from "../../services/product/queries";
import { useScrollControls } from "@/shared/hooks/use-scroll-controllers";
import { SliderSkeleton } from "../skeleton/SliderSkeleton";
import { SliderErrorFallback } from "./SliderErrorFallback";

export const ProductsSlider = () => {
	const { data: productPage, isPending, isError, refetch } = useProducts();

	const { sliderRef, canScrollLeft, canScrollRight, scroll } =
		useScrollControls({
			scrollRatio: 0.75,
			deps: [productPage, isPending],
		});

	const hasItems = Boolean(productPage?.items && productPage.items.length > 0);

	return (
		<section
			id="products"
			aria-label="Best selling products"
			className="bg-white py-16 border-b border-emerald-900/10"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
					<div className="flex-1">
						<p className="text-xs font-black uppercase tracking-widest text-emerald-700">
							Best sellers
						</p>
						<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950 sm:text-4xl">
							High-impact formulas.
						</h2>
						<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
							Each product is built to feel easy in real life: clear purpose,
							clean ingredients, and flavors that make consistency simpler.
						</p>
					</div>

					{/* Navigation Controls */}
					<div className="flex items-center gap-1.5 self-start sm:self-end">
						<Button
							variant="outline"
							size="icon"
							disabled={!canScrollLeft || isPending || !hasItems}
							className="size-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
							onClick={() => scroll("left")}
							aria-label="Scroll left"
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							disabled={!canScrollRight || isPending || !hasItems}
							className="size-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
							onClick={() => scroll("right")}
							aria-label="Scroll right"
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</div>

				{/* Content Container */}
				{isPending ? (
					<SliderSkeleton />
				) : isError || !hasItems ? (
					<SliderErrorFallback onRetry={() => void refetch()} />
				) : (
					<>
						<div
							ref={sliderRef}
							role="region"
							aria-label="Product Carousel"
							className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
						>
							{productPage.items.map((product) => (
								<div
									key={product.id}
									className="snap-start shrink-0 w-70 sm:w-[320px]"
								>
									<ProductCard product={product} />
								</div>
							))}
						</div>

						{/* See All Action */}
						<div className="mt-10 flex justify-center">
							<Button
								asChild
								variant="outline"
								className="rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 font-bold px-6 py-5 cursor-pointer"
							>
								<Link to={APP_ROUTES.SHOP}>
									See all products
									<ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</>
				)}
			</div>
		</section>
	);
};
