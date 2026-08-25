export const ProductPageSkeleton = () => {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Header Skeleton */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-brand-900/10 pb-5">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-surface-2" />
						<div className="h-3 w-28 bg-surface-2 rounded" />
					</div>
					<div className="h-8 w-48 bg-surface-2 rounded-lg" />
					<div className="h-4 w-72 bg-surface-2 rounded" />
				</div>
				<div className="flex items-center gap-2.5">
					<div className="h-9.5 w-24 bg-surface-2 rounded-lg" />
					<div className="h-9.5 w-32 bg-surface-2 rounded-lg" />
				</div>
			</div>

			{/* Analytics Skeleton Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-24 rounded-2xl bg-surface-2 p-4 space-y-3">
						<div className="h-4 w-1/2 bg-surface-2 rounded" />
						<div className="h-6 w-3/4 bg-surface-2 rounded" />
					</div>
				))}
			</div>

			{/* Table Shell Skeleton */}
			<div className="overflow-hidden rounded-2xl border border-brand-900/10 bg-card shadow-sm p-4 space-y-4">
				{/* Toolbar Skeleton */}
				<div className="flex flex-col sm:flex-row justify-between gap-3">
					<div className="h-10 w-full sm:w-64 bg-surface-2 rounded-lg" />
					<div className="flex gap-2">
						<div className="h-10 w-32 bg-surface-2 rounded-lg" />
						<div className="h-10 w-32 bg-surface-2 rounded-lg" />
					</div>
				</div>

				{/* Rows Skeleton */}
				<div className="space-y-3 pt-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-12 w-full bg-surface-2 rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
};
