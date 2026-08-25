import CONFIG from "@/app/config/constants";
import type { Cart } from "@/features/cart/schemas/cartSchema";
import { formatPrice } from "@/shared/utils/price";
import { ShieldCheckIcon, TruckIcon } from "lucide-react";

export const OrderReview = ({ cartSummary }: { cartSummary: Cart }) => {
	return (
		<div className="space-y-4">
			<div className="bg-card rounded-3xl border border-brand-900/5 p-5 sm:p-6 shadow-md shadow-brand-950/5">
				<h3 className="font-playfair text-lg font-bold text-ink mb-4 border-b border-brand-900/10 pb-3">
					Review Stack ({cartSummary.items.length})
				</h3>

				{/* Items list */}
				<div className="max-h-55 overflow-y-auto pr-1 divide-y divide-brand-900/10 scrollbar-none mb-4">
					{cartSummary.items.map(({ product, quantity }) => {
						return (
							<div
								key={product.id}
								className="flex gap-3 py-3 items-center justify-between first:pt-0 last:pb-0"
							>
								<div className="flex gap-3 items-center min-w-0">
									<div className="size-12 shrink-0 bg-surface-2 border border-brand-900/5 rounded-lg flex items-center justify-center p-1">
										<img
											src={product.imageUrl}
											alt={product.name}
											className="h-full w-full object-contain"
										/>
									</div>
									<div className="min-w-0">
										<p className="font-bold text-ink text-xs truncate leading-snug">
											{product.name}
										</p>
										<p className="text-[10px] text-ink-faint mt-0.5">
											{quantity}x &bull; Flavor
										</p>
									</div>
								</div>
								<span className="text-xs font-bold text-ink shrink-0">
									{formatPrice(product.price * quantity)}
								</span>
							</div>
						);
					})}
				</div>

				{/* Price review list */}
				<div className="space-y-2.5 text-xs border-t border-brand-900/10 pt-4">
					<div className="flex justify-between text-ink-soft">
						<span>Subtotal</span>
						<span className="font-bold text-ink">
							{formatPrice(cartSummary.subtotal)}
						</span>
					</div>

					{cartSummary.discount != null && cartSummary.discount > 0 && (
						<div className="flex justify-between text-ink-soft">
							<span>Discount</span>
							<span className="font-bold text-brand-700">
								-{formatPrice(cartSummary.discount)}
							</span>
						</div>
					)}

					{cartSummary.tax != null && cartSummary.tax > 0 && (
						<div className="flex justify-between text-ink-soft">
							<span>Tax</span>
							<span className="font-bold text-ink">
								{formatPrice(cartSummary.tax)}
							</span>
						</div>
					)}

					<div className="flex justify-between text-ink-soft">
						<span>Shipping</span>
						{cartSummary.shipping == null ? (
							"calculated during checkout"
						) : (
							<span className="font-bold text-ink">
								{cartSummary.shipping === 0 ? (
									<span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md text-[10px] uppercase">
										Free
									</span>
								) : (
									`${formatPrice(cartSummary.shipping)}`
								)}
							</span>
						)}
					</div>

					<div className="flex justify-between text-sm font-black text-ink border-t border-brand-900/10 pt-3 mt-2">
						<span>Order Total</span>
						<span>{formatPrice(cartSummary.total)}</span>
					</div>
				</div>
			</div>

			{/* Trust USPs */}
			<div className="bg-card rounded-3xl border border-brand-900/5 p-5 shadow-xs space-y-4">
				<div className="flex items-start gap-3">
					<ShieldCheckIcon className="size-5 text-brand-700 shrink-0 mt-0.5" />
					<div>
						<h4 className="text-xs font-bold text-ink font-sans">
							Money-Back Guarantee
						</h4>
						<p className="text-[10px] text-ink-soft leading-normal mt-0.5">
							If your stack doesn't help you feel more consistent within 30
							days, we'll refund you 100%. No questions asked.
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<TruckIcon className="size-5 text-brand-700 shrink-0 mt-0.5" />
					<div>
						<h4 className="text-xs font-bold text-ink font-sans">
							Insured Shipping
						</h4>
						<p className="text-[10px] text-ink-soft leading-normal mt-0.5">
							All {CONFIG.APP_NAME} deliveries are fully insured. If your
							canister is damaged in transit, we ship a replacement immediately.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
