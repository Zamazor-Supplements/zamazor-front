export const ShoppingCartItemSkeleton = () => (
	<div className="flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-100 animate-pulse">
		<div className="flex items-center gap-3 min-w-0 flex-1">
			<div className="size-16 sm:size-18 shrink-0 bg-slate-200 rounded-lg" />
			<div className="min-w-0 flex-1 space-y-2">
				<div className="h-4 bg-slate-200 rounded-md w-3/4" />
				<div className="h-3 bg-slate-100 rounded-md w-1/3" />
				<div className="h-3 bg-slate-100 rounded-md w-1/4" />
			</div>
		</div>
		<div className="flex items-center gap-3 sm:gap-5 shrink-0">
			<div className="h-8 w-20 bg-slate-200 rounded-lg" />
			<div className="h-5 w-14 bg-slate-200 rounded-md" />
			<div className="size-7 bg-slate-100 rounded-lg" />
		</div>
	</div>
);
