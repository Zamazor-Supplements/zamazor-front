import { ProductCardSkeleton } from "./ProductCardSkeleton";

export const SliderSkeleton = ({ cardCount = 4 }: { cardCount?: number }) => (
	<div className="flex gap-6 w-full">
		{Array.from({ length: cardCount }).map((_, i) => (
			<div key={i} className="snap-start shrink-0 w-70 sm:w-[320px]">
				<ProductCardSkeleton />
			</div>
		))}
	</div>
);
