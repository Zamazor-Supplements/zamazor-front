export const OrderPageSkeleton = () => {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Header Skeleton */}
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-2">
					<div className="h-3 w-20 rounded-md bg-slate-200" />
					<div className="h-8 w-48 rounded-lg bg-slate-200" />
					<div className="h-4 w-72 rounded-md bg-slate-200" />
				</div>
				<div className="h-10 w-28 rounded-xl bg-slate-200" />
			</div>

			{/* Analytics Card Skeleton */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<div className="h-28 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-5" />
				<div className="h-28 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-5" />
			</div>

			{/* Table Container Skeleton */}
			<div className="h-112.5 rounded-3xl border border-slate-200/80 bg-slate-100/70 p-6" />
		</div>
	);
};
