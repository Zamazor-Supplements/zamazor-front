import { TruckIcon } from "lucide-react";
import { useLanguage } from "@/shared/hooks/use-language";
import { formatPrice } from "@/shared/utils/price";
import { cn } from "@/lib/utils";

/** Free-shipping threshold for Casablanca & surroundings (see ShippingPage). */
export const FREE_SHIPPING_THRESHOLD = 300;

interface ShippingProgressProps {
	subtotal: number;
	threshold?: number;
	className?: string;
}

/**
 * Free-shipping nudge: shows how much is left to unlock free delivery,
 * or a "free shipping unlocked" pill once the subtotal clears the bar.
 */
export const ShippingProgress = ({
	subtotal,
	threshold = FREE_SHIPPING_THRESHOLD,
	className,
}: ShippingProgressProps) => {
	const { t } = useLanguage();

	const remaining = Math.max(0, threshold - subtotal);
	const unlocked = remaining <= 0;
	const progress = Math.min(100, (subtotal / threshold) * 100);

	if (unlocked) {
		return (
			<div
				className={cn(
					"flex items-center gap-2.5 rounded-lg border border-brand-900/10 bg-brand-50/80 px-4 py-3 shadow-2xs",
					className,
				)}
			>
				<TruckIcon className="size-4 shrink-0 text-brand-800" />
				<p className="text-xs font-bold text-brand-900">
					{t("cart.freeShippingUnlocked")}
				</p>
			</div>
		);
	}

	const label = t("cart.freeShippingLeft").replace(
		"{amount}",
		formatPrice(remaining),
	);

	return (
		<div
			className={cn(
				"space-y-2 rounded-lg bg-slate-50/60 p-3 border border-slate-100",
				className,
			)}
		>
			<div className="flex justify-between items-center text-xs">
				<span className="font-medium text-ink-soft">{label}</span>
				<span className="font-bold text-ink">{Math.round(progress)}%</span>
			</div>
			<div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100/70">
				<div
					className="h-full rounded-full bg-linear-to-r from-brand-500 to-accent transition-all duration-500"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
};
