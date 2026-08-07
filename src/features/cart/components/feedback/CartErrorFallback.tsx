import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { AlertCircleIcon, RotateCcwIcon } from "lucide-react";
import { Link } from "react-router";

export const CartErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
	<div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
		<div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
			<AlertCircleIcon className="size-7" />
		</div>
		<h2 className="mt-4 font-playfair text-2xl font-semibold text-slate-900 sm:text-3xl">
			Error loading cart
		</h2>
		<p className="mt-2 max-w-md text-sm text-slate-500">
			We couldn't fetch your cart summary right now. Please check your network
			and try again.
		</p>
		<div className="mt-6 flex items-center gap-3">
			<Button
				onClick={onRetry}
				className="flex items-center gap-2 rounded-xl bg-emerald-900 px-6 py-2.5 text-white hover:bg-emerald-950 cursor-pointer"
			>
				<RotateCcwIcon className="size-4" />
				Try Again
			</Button>
			<Button
				asChild
				variant="outline"
				className="rounded-xl border-slate-200 px-6 py-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer"
			>
				<Link to={APP_ROUTES.SHOP}>Return to shop</Link>
			</Button>
		</div>
	</div>
);
