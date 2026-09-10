import { ProductCardSkeleton } from "@/features/products/components/skeleton/ProductCardSkeleton";

export function WishlistPageSkeleton() {
	return (
		<div className="min-h-screen bg-[#fcfdfa] px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="h-20 w-1/3 animate-pulse rounded-2xl bg-slate-200/60" />
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<ProductCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
