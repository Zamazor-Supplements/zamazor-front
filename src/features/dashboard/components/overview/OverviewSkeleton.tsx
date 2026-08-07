export const OverviewSkeleton = () => (
	<div className="space-y-6 animate-pulse">
		<div className="h-44 w-full rounded-3xl bg-slate-100" />
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="h-28 rounded-2xl bg-slate-100" />
			))}
		</div>
		<div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
			<div className="h-80 rounded-3xl bg-slate-100" />
			<div className="space-y-6">
				<div className="h-36 rounded-3xl bg-slate-100" />
				<div className="h-36 rounded-3xl bg-slate-100" />
			</div>
		</div>
	</div>
);
