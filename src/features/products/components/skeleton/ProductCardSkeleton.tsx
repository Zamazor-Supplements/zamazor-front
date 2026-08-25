import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductCardSkeleton() {
	return (
		<div className="relative flex h-full flex-col justify-between rounded-xl border border-brand-950/5 bg-white p-4 shadow-sm">
			<div>
				{/* Image Container Matching Real Card */}
				<div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-xl bg-slate-50 border border-gray-100/60">
					{/* Category Pill Badge Skeleton */}
					<Skeleton className="absolute left-3 top-3 h-6 w-24 rounded-full" />

					{/* Wishlist Button Icon Skeleton */}
					<Skeleton className="absolute right-3 top-3 size-9 rounded-full" />
				</div>

				{/* Product Details Section */}
				<div className="mt-4 px-1">
					{/* Sub-category Label Skeleton */}
					<Skeleton className="h-3 w-16 rounded" />

					{/* Title and Price Row Skeleton */}
					<div className="mt-1 flex items-baseline justify-between gap-2">
						<Skeleton className="h-6 w-3/5 rounded-md" />
						<Skeleton className="h-5 w-14 rounded-md shrink-0" />
					</div>
				</div>
			</div>

			{/* Add To Cart Action Button Skeleton */}
			<Skeleton className="mt-5 h-10 w-full rounded-lg" />
		</div>
	);
}
