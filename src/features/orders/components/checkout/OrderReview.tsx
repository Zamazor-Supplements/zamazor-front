import CONFIG from "@/app/config/constants";
import type { CartSummary } from "@/features/cart/schemas/cartSchema";
import { formatCurrency } from "@/shared/utils/price";
import { ShieldCheckIcon, TruckIcon } from "lucide-react";

export const OrderReview = ({ cartSummary }: { cartSummary: CartSummary }) => {
	return (
		<div className="space-y-4">
			<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-6 shadow-md shadow-emerald-950/5">
				<h3 className="font-playfair text-lg font-bold text-slate-950 mb-4 border-b border-slate-100 pb-3">
					Review Stack ({cartSummary.items.length})
				</h3>

				{/* Items list */}
				<div className="max-h-55 overflow-y-auto pr-1 divide-y divide-slate-100 scrollbar-none mb-4">
					{cartSummary.items.map(({ product, quantity }) => {
						return (
							<div
								key={product.id}
								className="flex gap-3 py-3 items-center justify-between first:pt-0 last:pb-0"
							>
								<div className="flex gap-3 items-center min-w-0">
									<div className="size-12 shrink-0 bg-slate-50 border border-emerald-900/5 rounded-xl flex items-center justify-center p-1">
										<img
											src={product.imageUrl}
											alt={product.name}
											className="h-full w-full object-contain"
										/>
									</div>
									<div className="min-w-0">
										<p className="font-bold text-slate-900 text-xs truncate leading-snug">
											{product.name}
										</p>
										<p className="text-[10px] text-slate-400 mt-0.5">
											{quantity}x &bull; Flavor
										</p>
									</div>
								</div>
								<span className="text-xs font-bold text-slate-900 shrink-0">
									{formatCurrency(product.price * quantity)}
								</span>
							</div>
						);
					})}
				</div>

				{/* Price review list */}
				<div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
					<div className="flex justify-between text-slate-500">
						<span>Subtotal</span>
						<span className="font-bold text-slate-900">
							{formatCurrency(cartSummary.subtotal)}
						</span>
					</div>

					<div className="flex justify-between text-slate-500">
						<span>Shipping</span>
						{cartSummary.shipping == null ? (
							"calculated during checkout"
						) : (
							<span className="font-bold text-slate-900">
								{cartSummary.shipping === 0 ? (
									<span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] uppercase">
										Free
									</span>
								) : (
									`${formatCurrency(cartSummary.shipping)}`
								)}
							</span>
						)}
					</div>

					<div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-3 mt-2">
						<span>Order Total</span>
						<span>{formatCurrency(cartSummary.total)}</span>
					</div>
				</div>
			</div>

			{/* Trust USPs */}
			<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 shadow-xs space-y-4">
				<div className="flex items-start gap-3">
					<ShieldCheckIcon className="size-5 text-emerald-700 shrink-0 mt-0.5" />
					<div>
						<h4 className="text-xs font-bold text-slate-950 font-sans">
							Money-Back Guarantee
						</h4>
						<p className="text-[10px] text-slate-500 leading-normal mt-0.5">
							If your stack doesn't help you feel more consistent within 30
							days, we'll refund you 100%. No questions asked.
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<TruckIcon className="size-5 text-emerald-700 shrink-0 mt-0.5" />
					<div>
						<h4 className="text-xs font-bold text-slate-950 font-sans">
							Insured Shipping
						</h4>
						<p className="text-[10px] text-slate-500 leading-normal mt-0.5">
							All {CONFIG.APP_NAME} deliveries are fully insured. If your
							canister is damaged in transit, we ship a replacement immediately.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
