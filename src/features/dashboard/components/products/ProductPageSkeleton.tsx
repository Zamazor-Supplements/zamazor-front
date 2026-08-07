export const ProductPageSkeleton = () => {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Header Skeleton */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-slate-200" />
						<div className="h-3 w-28 bg-slate-200 rounded" />
					</div>
					<div className="h-8 w-48 bg-slate-200 rounded-lg" />
					<div className="h-4 w-72 bg-slate-200 rounded" />
				</div>
				<div className="flex items-center gap-2.5">
					<div className="h-9.5 w-24 bg-slate-200 rounded-xl" />
					<div className="h-9.5 w-32 bg-slate-200 rounded-xl" />
				</div>
			</div>

			{/* Analytics Skeleton Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-24 rounded-2xl bg-slate-100 p-4 space-y-3">
						<div className="h-4 w-1/2 bg-slate-200 rounded" />
						<div className="h-6 w-3/4 bg-slate-200 rounded" />
					</div>
				))}
			</div>

			{/* Table Shell Skeleton */}
			<div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 space-y-4">
				{/* Toolbar Skeleton */}
				<div className="flex flex-col sm:flex-row justify-between gap-3">
					<div className="h-10 w-full sm:w-64 bg-slate-100 rounded-xl" />
					<div className="flex gap-2">
						<div className="h-10 w-32 bg-slate-100 rounded-xl" />
						<div className="h-10 w-32 bg-slate-100 rounded-xl" />
					</div>
				</div>

				{/* Rows Skeleton */}
				<div className="space-y-3 pt-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-12 w-full bg-slate-50 rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
};
