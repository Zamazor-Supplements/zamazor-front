import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import {
	ArrowRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { Link } from "react-router";
import { useProducts } from "../../services/product/queries";
import { useScrollControls } from "@/shared/hooks/use-scroll-controllers";
import { sectionLift } from "@/shared/config/motion";
import { motion } from "framer-motion";
import { ProductSliderTrack } from "./ProductSliderTrack";
import { useEffect } from "react";

export const BestSellersSection = () => {
	const { data: productPage, isPending, isError, refetch } = useProducts();

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
			id="products"
			aria-label="Best selling products"
			className="bg-white py-20 border-b border-brand-900/10 overflow-hidden"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-9">
					<div className="flex-1">
						<p className="text-xs font-black uppercase tracking-widest text-brand-700">
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

					<SliderNavigation
						canScrollLeft={canScrollLeft}
						canScrollRight={canScrollRight}
						isPending={isPending}
						hasItems={hasItems}
						onScroll={scroll}
					/>
				</div>

				<ProductSliderTrack
					sliderRef={sliderRef}
					productPage={productPage}
					isPending={isPending}
					isError={isError}
					refetch={() => void refetch()}
					activeCategoryId="best-sellers"
				/>

				{!isPending && !isError && hasItems && (
					<div className="mt-10 flex justify-center">
						<Button
							asChild
							variant="outline"
							className="rounded-lg border-brand-900/10 text-brand-800 hover:bg-brand-50 hover:text-brand-950 font-bold px-6 py-5 cursor-pointer"
						>
							<Link to={APP_ROUTES.SHOP}>
								See all products
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				)}
			</div>
		</motion.section>
	);
};

interface SliderNavigationProps {
	canScrollLeft: boolean;
	canScrollRight: boolean;
	isPending: boolean;
	hasItems: boolean;
	onScroll: (direction: "left" | "right") => void;
}

const SliderNavigation = ({
	canScrollLeft,
	canScrollRight,
	isPending,
	hasItems,
	onScroll,
}: SliderNavigationProps) => (
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
