export const CartPageSkeleton = () => (
	<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200 mb-8" />
		<div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
			{/* Items Skeleton */}
			<div className="space-y-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="h-28 w-full animate-pulse rounded-2xl bg-slate-100"
					/>
				))}
			</div>
			{/* Summary Panel Skeleton */}
			<div className="h-80 w-full animate-pulse rounded-3xl bg-slate-100" />
		</div>
	</main>
);
