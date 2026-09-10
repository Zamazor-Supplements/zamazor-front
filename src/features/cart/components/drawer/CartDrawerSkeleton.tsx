import { ShoppingCartItemSkeleton } from "./ShoppingCartItemSkeleton";

export const CartDrawerSkeleton = () => (
	<div className="flex flex-col h-full overflow-hidden">
		<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
			<div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
			<div className="space-y-3 pt-1">
				<ShoppingCartItemSkeleton />
				<ShoppingCartItemSkeleton />
				<ShoppingCartItemSkeleton />
			</div>
		</div>
		<div className="sticky bottom-0 space-y-3 border-t border-slate-100 bg-card px-4 py-4 sm:px-6 sm:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
			<div className="flex items-center justify-between animate-pulse">
				<div className="h-4 bg-slate-200 rounded w-16" />
				<div className="h-6 bg-slate-200 rounded w-20" />
			</div>
			<div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse" />
			<div className="h-3 w-28 bg-slate-100 rounded mx-auto animate-pulse" />
		</div>
	</div>
);
