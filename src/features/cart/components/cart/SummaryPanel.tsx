import { useNavigate } from "react-router";
import type { Cart } from "../../schemas/cartSchema";
import { useLanguage } from "@/shared/hooks/use-language";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { formatPrice } from "@/shared/utils/price";
import { Button } from "@/shared/components/ui/button";
import { APP_ROUTES } from "@/app/routes/paths";
import CONFIG from "@/app/config/constants";

interface SummaryPannelProps {
	summary: Cart;
	isFetching: boolean;
}

export const SummaryPanel = ({ summary, isFetching }: SummaryPannelProps) => {
	const navigate = useNavigate();
	const { t } = useLanguage();
	const subtotal = summary.subtotal;
	const shippingCost = summary.shipping;
	const total = summary.total;

	return (
		<div className="space-y-4">
			<div className="bg-white rounded-3xl border border-brand-900/5 p-5 sm:p-6 shadow-md shadow-brand-950/5 relative">
				{/* Discrete indicator when background refetching happens */}
				{isFetching && (
					<div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-slate-400">
						<Loader2Icon className="size-3 animate-spin" />
					</div>
				)}

				<h3 className="font-playfair text-xl font-bold text-slate-950 mb-5 border-b border-slate-100 pb-4">
					{t("checkout.orderSummary")}
				</h3>

				<div
					className={`space-y-3.5 text-sm transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
				>
					{/* Subtotal */}
					<div className="flex justify-between text-slate-600">
						<span>{t("cart.subtotal")}</span>
						<span className="font-bold text-slate-900">
							{formatPrice(subtotal)}
						</span>
					</div>

					{/* Shipping */}
					<div className="flex justify-between text-slate-600">
						<span>{t("cart.shipping")}</span>
						{shippingCost == null ? (
							<span className="text-slate-500 text-xs">
								Calculated during checkout
							</span>
						) : shippingCost === 0 ? (
							<span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md text-xs uppercase tracking-wide">
								Free
							</span>
						) : (
							<span className="font-bold text-slate-900">
								{formatPrice(shippingCost)}
							</span>
						)}
					</div>

					{/* Total */}
					<div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-4 mt-2">
						<span>{t("cart.total")}</span>
						<span>{formatPrice(total)}</span>
					</div>
				</div>

				{/* Checkout button */}
				<Button
					onClick={() => navigate(APP_ROUTES.CHECKOUT.ROOT)}
					className="w-full h-12 bg-brand-900 hover:bg-brand-950 text-white font-bold rounded-lg mt-6 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-950/10"
				>
					{t("cart.checkoutBtn")}
					<ArrowRightIcon className="size-4" />
				</Button>
			</div>

			{/* Info panel */}
			<div className="rounded-2xl border border-brand-900/5 bg-[#f0f7ec] p-4 text-center">
				<p className="text-[11px] leading-relaxed text-slate-600">
					🌿 {CONFIG.APP_NAME} orders are processed within 24 hours.
					Subscription stacks save an additional 15% on repeat deliveries with
					total cancel/skip controls.{" "}
				</p>
			</div>
		</div>
	);
};
