import { useMemo, useState } from "react";
import { useCategories } from "../../services/category/queries";
import { useProducts } from "../../services/product/queries";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "../product/ProductCard";
import { useScrollControls } from "@/shared/hooks/use-scroll-controllers";
import { sectionLift } from "@/app/config/motion";
import { SliderSkeleton } from "../skeleton/SliderSkeleton";
import { SliderErrorFallback } from "../slider/SliderErrorFallback";

export const CategorySlider = () => {
	const { data: categories, refetch: refetchCategories } = useCategories();
	const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(
		undefined,
	);

	const {
		data: productPage,
		isPending: isPendingProducts,
		isError,
		refetch: refetchProducts,
	} = useProducts({
		categoryId: activeCategoryId,
	});

	const categoryTabs = useMemo(() => {
		return [{ id: undefined, label: "All" }, ...(categories ?? [])];
	}, [categories]);

	const { sliderRef, canScrollLeft, canScrollRight, scroll } =
		useScrollControls({
			scrollRatio: 0.75,
			deps: [productPage, isPendingProducts],
		});

	const hasItems = Boolean(productPage?.items && productPage.items.length > 0);

	return (
		<motion.section
			variants={sectionLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.18 }}
			transition={{ duration: 0.34, ease: "easeOut" }}
			className="bg-linear-to-b from-emerald-50/30 via-[#f6fbf2] to-[#fcfdfa] py-20 border-b border-emerald-900/10 overflow-hidden"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
					<div className="flex-1">
						<p className="text-xs font-black uppercase tracking-widest text-emerald-700">
							Explore formulas
						</p>
						<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950 sm:text-4xl">
							Shop by Category.
						</h2>
						<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
							Select a category to filter. Each blend is created to help you
							reach target performance and recovery goals with zero fluff.
						</p>
					</div>

					{/* Navigation Controls */}
					<div className="flex items-center gap-1.5 self-start sm:self-end">
						<Button
							variant="outline"
							size="icon"
							disabled={!canScrollLeft || isPendingProducts || !hasItems}
							className="size-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
							onClick={() => scroll("left")}
							aria-label="Scroll left"
						>
							<ChevronLeftIcon className="size-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							disabled={!canScrollRight || isPendingProducts || !hasItems}
							className="size-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
							onClick={() => scroll("right")}
							aria-label="Scroll right"
						>
							<ChevronRightIcon className="size-4" />
						</Button>
					</div>
				</div>

				{/* Category Tabs */}
				<div
					role="tablist"
					aria-label="Shop by Category"
					className="flex overflow-x-auto gap-2.5 pb-4 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] snap-x mb-8"
				>
					{categoryTabs.map((category) => {
						const isActive = activeCategoryId === category.id;
						return (
							<button
								key={category.id ?? "All"}
								role="tab"
								aria-selected={isActive}
								onClick={() => setActiveCategoryId(category.id)}
								className={cn(
									"px-5 py-2 text-xs font-bold rounded-full border transition-all duration-200 cursor-pointer snap-start shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20",
									isActive
										? "bg-emerald-950 text-white border-emerald-950 shadow-md shadow-emerald-950/10"
										: "bg-white text-emerald-800 border-emerald-900/10 hover:bg-emerald-50 hover:text-emerald-950 hover:-translate-y-0.5",
								)}
							>
								{category.label}
							</button>
						);
					})}
				</div>

				{/* Slider Container with AnimatePresence */}
				<div
					ref={sliderRef}
					role="region"
					aria-label="Category products slider"
					className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] min-h-100"
				>
					<AnimatePresence mode="wait">
						{isPendingProducts ? (
							<motion.div
								key="loading-state"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
								className="w-full"
							>
								<SliderSkeleton />
							</motion.div>
						) : isError || !hasItems ? (
							<motion.div
								key="fallback-state"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.2 }}
								className="w-full"
							>
								<SliderErrorFallback
									title="No products in this category"
									description="There are no items currently assigned to this category. Check back soon or select another category."
									onRetry={() => {
										refetchProducts();
										refetchCategories();
									}}
								/>
							</motion.div>
						) : (
							<motion.div
								key={activeCategoryId ?? "all-products"}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="flex gap-6"
							>
								{productPage.items.map((product) => (
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
			</div>
		</motion.section>
	);
};
