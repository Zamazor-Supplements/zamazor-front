import { Skeleton } from "@/shared/components/ui/skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export const ProductDetailSkeleton = () => (
	<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{/* Back Navigation Skeleton */}
		<Skeleton className="mb-8 h-5 w-32 rounded-md" />

		{/* Main Product Section Grid */}
		<div className="grid gap-12 lg:grid-cols-2 lg:items-start">
			<Skeleton className="aspect-square w-full rounded-hero" />
			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-28 rounded" />
					<Skeleton className="h-10 w-3/4 rounded-lg" />
					<Skeleton className="h-5 w-36 rounded" />
				</div>
				<Skeleton className="h-8 w-24 rounded-lg" />
				<Skeleton className="h-20 w-full rounded-2xl" />
				<Skeleton className="h-12 w-full rounded-lg" />
			</div>
		</div>

		{/* Recommendations Section Skeleton (Prevents Layout Shift) */}
		<section className="mt-20 border-t border-brand-900/10 pt-16">
			<div className="mb-12 text-center space-y-3 flex flex-col items-center">
				<Skeleton className="h-3 w-32 rounded" />
				<Skeleton className="h-9 w-72 sm:w-96 rounded-lg" />
				<Skeleton className="h-4 w-full max-w-xl rounded" />
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<ProductCardSkeleton key={i} />
				))}
			</div>
		</section>
	</main>
);
