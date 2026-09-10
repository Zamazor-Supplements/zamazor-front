import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { ArrowRightIcon, PackageSearchIcon, RotateCcwIcon } from "lucide-react";
import { Link } from "react-router";

interface SliderErrorFallbackProps {
	title?: string;
	description?: string;
	onRetry?: () => void;
	showShopLink?: boolean;
}

export const SliderErrorFallback = ({
	title = "No formulas available right now",
	description = "We couldn't load these products at the moment. Please try again or explore our full collection.",
	onRetry,
	showShopLink = true,
}: SliderErrorFallbackProps) => (
	<div className="flex w-full min-h-70 items-center justify-center py-6 px-4">
		<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-900/15 bg-white/80 backdrop-blur-xs p-6 sm:p-8 text-center shadow-2xs max-w-md w-full">
			{/* Compact Icon Container */}
			<div className="flex size-12 items-center justify-center rounded-lg bg-brand-50 text-brand-800 border border-brand-950/5">
				<PackageSearchIcon className="size-5" />
			</div>

			{/* Tightened Typography */}
			<h3 className="mt-3.5 font-playfair text-lg sm:text-xl font-medium text-slate-900 tracking-tight">
				{title}
			</h3>
			<p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs">
				{description}
			</p>

			{/* Proportional, Clean Buttons */}
			<div className="mt-5 flex items-center justify-center gap-2.5 w-full">
				{onRetry && (
					<Button
						onClick={onRetry}
						variant="outline"
						size="sm"
						className="h-9 rounded-lg border-brand-900/15 bg-white text-brand-900 hover:bg-brand-50 text-xs font-medium cursor-pointer transition-all active:scale-95"
					>
						<RotateCcwIcon className="mr-1.5 size-3.5 text-brand-700" />
						Refresh
					</Button>
				)}
				{showShopLink && (
					<Button
						asChild
						size="sm"
						className="h-9 rounded-lg bg-brand-900 text-white hover:bg-brand-950 text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-2xs"
					>
						<Link to={APP_ROUTES.SHOP}>
							Explore shop
							<ArrowRightIcon className="ml-1.5 size-3.5" />
						</Link>
					</Button>
				)}
			</div>
		</div>
	</div>
);
