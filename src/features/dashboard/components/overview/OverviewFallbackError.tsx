import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

export const OverviewFallbackError = ({
	onRefetch,
}: {
	onRefetch: () => void;
}) => {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
			<div className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 shadow-xs">
				<AlertTriangleIcon className="size-6" />
			</div>
			<h3 className="mt-4 text-base font-bold text-slate-900">
				Failed to Sync Analytics
			</h3>
			<p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
				We couldn't retrieve the dashboard overview data right now. Please check
				your network or try again.
			</p>
			<button
				type="button"
				onClick={onRefetch}
				className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 active:scale-95"
			>
				<RefreshCwIcon className="size-3.5" />
				Try Again
			</button>
		</div>
	);
};
