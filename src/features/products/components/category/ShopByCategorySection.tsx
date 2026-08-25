import { useEffect, useState } from "react";
import { useProducts } from "../../services/product/queries";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useScrollControls } from "@/shared/hooks/use-scroll-controllers";
import { sectionLift } from "@/shared/config/motion";
import { CategoryTabs } from "./CategoryTabs";
import { ProductSliderTrack } from "../slider/ProductSliderTrack";

export const ShopByCategorySection = () => {
	const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(
		undefined,
	);

	const {
		data: productPage,
		isPending,
		isError,
		refetch,
	} = useProducts({
		categoryId: activeCategoryId,
	});

	const {
		sliderRef,
		canScrollLeft,
		canScrollRight,
		scroll,
		updateScrollButtons,
	} = useScrollControls({
		scrollRatio: 0.75,
	});

	useEffect(() => {
		updateScrollButtons();
	}, [productPage, isPending, updateScrollButtons]);

	const hasItems = Boolean(productPage?.items && productPage.items.length > 0);

	return (
		<motion.section
			variants={sectionLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.18 }}
			transition={{ duration: 0.34, ease: "easeOut" }}
			className="bg-linear-to-b from-brand-50/30 via-[#f6fbf2] to-[#fcfdfa] py-20 border-b border-brand-900/10 overflow-hidden"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
					<div className="flex-1">
						<p className="text-xs font-black uppercase tracking-widest text-brand-700">
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

					<CategorySliderNavigation
						canScrollLeft={canScrollLeft}
						canScrollRight={canScrollRight}
						isPending={isPending}
						hasItems={hasItems}
						onScroll={scroll}
					/>
				</div>

				<CategoryTabs
					activeCategoryId={activeCategoryId}
					setActiveCategoryId={setActiveCategoryId}
				/>

				<ProductSliderTrack
					sliderRef={sliderRef}
					productPage={productPage}
					isPending={isPending}
					isError={isError}
					refetch={refetch}
					activeCategoryId={activeCategoryId}
				/>
			</div>
		</motion.section>
	);
};

interface CategorySliderNavigationProps {
	canScrollLeft: boolean;
	canScrollRight: boolean;
	isPending: boolean;
	hasItems: boolean;
	onScroll: (direction: "left" | "right") => void;
}

const CategorySliderNavigation = ({
	canScrollLeft,
	canScrollRight,
	isPending,
	hasItems,
	onScroll,
}: CategorySliderNavigationProps) => (
	<div className="flex items-center gap-1.5 self-start sm:self-end">
		<Button
			variant="outline"
			size="icon"
			disabled={!canScrollLeft || isPending || !hasItems}
			className="size-9 rounded-lg border-brand-900/10 text-brand-800 hover:bg-brand-50 hover:text-brand-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
			onClick={() => onScroll("left")}
			aria-label="Scroll left"
		>
			<ChevronLeftIcon className="size-4" />
		</Button>
		<Button
			variant="outline"
			size="icon"
			disabled={!canScrollRight || isPending || !hasItems}
			className="size-9 rounded-lg border-brand-900/10 text-brand-800 hover:bg-brand-50 hover:text-brand-950 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
			onClick={() => onScroll("right")}
			aria-label="Scroll right"
		>
			<ChevronRightIcon className="size-4" />
		</Button>
	</div>
);
