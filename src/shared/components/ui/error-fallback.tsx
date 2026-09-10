/**
 * Consistent error-state block for the whole app — mirrors the empty-state
 * pattern but uses a rose-tinted icon to signal failure. Drop-in replacement
 * for the per-page `CartErrorFallback`, `WishlistPageError`, and
 * `OverviewFallbackError` components.
 */
import { AlertCircleIcon, RotateCwIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
	title?: string;
	description?: string;
	onRetry?: () => void;
	retryLabel?: string;
	/** Optional secondary action slot (e.g. a "Return to shop" link). */
	secondaryAction?: ReactNode;
	className?: string;
}

export const ErrorFallback = ({
	title = "Something went wrong",
	description = "We couldn't complete this request. Please check your network and try again.",
	onRetry,
	retryLabel = "Try Again",
	secondaryAction,
	className,
}: ErrorFallbackProps) => (
	<div
		className={cn(
			"flex min-h-[60vh] flex-col items-center justify-center p-6 text-center",
			className,
		)}
	>
		<div className="grid size-14 place-items-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 shadow-xs">
			<AlertCircleIcon className="size-7" />
		</div>
		<h3 className="mt-4 font-playfair text-2xl font-semibold text-ink sm:text-3xl">
			{title}
		</h3>
		<p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
			{description}
		</p>
		{(onRetry || secondaryAction) && (
			<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
				{onRetry && (
					<Button
						onClick={onRetry}
						className="flex items-center gap-2 rounded-lg bg-brand-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-950"
					>
						<RotateCwIcon className="size-4" />
						{retryLabel}
					</Button>
				)}
				{secondaryAction}
			</div>
		)}
	</div>
);