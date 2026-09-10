import { formatCurrency } from "@/shared/utils/price";
import { motion } from "framer-motion";
import { CARD_ANIMATION } from "../../config/motion";
import { ShoppingBagIcon, TrophyIcon } from "lucide-react";

interface TopProduct {
	id: string;
	name: string;
	category: string;
	quantity: number;
	revenue: number;
}

export const TopProducts = ({ products }: { products: TopProduct[] }) => {
	return (
		<motion.section
			{...CARD_ANIMATION}
			className="flex flex-col justify-between rounded-xl border border-brand-900/10 bg-card p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header */}
			<div className="mb-5 flex items-center justify-between gap-3 border-b border-brand-900/10 pb-3">
				<div className="flex items-center gap-2 min-w-0">
					<div className="rounded-lg bg-amber-50 p-2 text-amber-600 shrink-0">
						<TrophyIcon className="size-4" />
					</div>
					<div className="min-w-0">
						<h3 className="text-base font-bold text-ink truncate">
							Top Performing Products
						</h3>
						<p className="text-xs text-ink-soft truncate">
							Ranked by quantity sold & total revenue
						</p>
					</div>
				</div>
			</div>

			{/* Empty State */}
			{products.length === 0 ? (
				<div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-900/10 bg-surface-2/50 p-6 text-center text-xs text-ink-faint">
					<ShoppingBagIcon className="size-6 mb-2 text-ink-faint" />
					Product performance metrics will show up here once sales occur.
				</div>
			) : (
				<div className="space-y-2.5 min-w-0">
					{products.map((product, index) => {
						return (
							<div
								key={product.id}
								className="group relative flex items-center justify-between gap-3 rounded-lg border border-brand-900/10 bg-surface-2/30 p-3.5 transition-all duration-200 hover:border-brand-900/10 hover:bg-surface-2/80 hover:shadow-2xs min-w-0"
							>
								{/* Product Meta */}
								<div className="flex min-w-0 items-center gap-3 flex-1">
									<span
										className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black transition-transform group-hover:scale-105 ${
											index === 0
												? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
												: index === 1
													? "bg-surface-2 text-ink"
													: index === 2
														? "bg-amber-700/10 text-amber-800"
														: "bg-surface-2 text-ink-soft"
										}`}
									>
										#{index + 1}
									</span>

									<div className="min-w-0 flex-1">
										<p className="truncate text-xs font-bold text-ink group-hover:text-brand-900 transition-colors">
											{product.name}
										</p>
										<p className="mt-0.5 truncate text-[11px] font-medium text-ink-faint">
											{product.category}
										</p>
									</div>
								</div>

								{/* Revenue & Quantity Stats */}
								<div className="text-right shrink-0 pl-2">
									<p className="text-xs font-bold text-ink">
										{formatCurrency(product.revenue)}
									</p>
									<p className="mt-0.5 text-[11px] font-semibold text-ink-faint">
										{product.quantity} units sold
									</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</motion.section>
	);
};
