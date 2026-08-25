import { motion } from "framer-motion";
import { CARD_ANIMATION } from "../../config/motion";
import type { CategorySummary } from "../../schemas/dashboardSchema";
import { LayersIcon } from "lucide-react";

interface CategoryMixProps {
	categories: CategorySummary[];
	totalProducts: number;
}

export const CategoryMix = ({
	categories,
	totalProducts,
}: CategoryMixProps) => {
	return (
		<motion.section
			{...CARD_ANIMATION}
			className="rounded-xl border border-brand-900/10 bg-card p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header */}
			<div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-brand-900/10 pb-3">
				<div className="flex items-center gap-2 min-w-0">
					<div className="rounded-lg bg-brand-50 p-2 text-brand-800 shrink-0">
						<LayersIcon className="size-4" />
					</div>
					<h3 className="text-base font-bold text-ink truncate">
						Category Mix
					</h3>
				</div>
				<span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-semibold text-ink-soft shrink-0">
					{totalProducts} Total Items
				</span>
			</div>

			{/* Empty State */}
			{categories.length === 0 ? (
				<div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-brand-900/10 bg-surface-2/50 p-4 text-center text-xs text-ink-faint">
					No categories found. Add products to generate category analytics.
				</div>
			) : (
				<div className="space-y-4 min-w-0">
					{categories.map((entry) => {
						const percentage =
							totalProducts > 0
								? Math.round((entry.count / totalProducts) * 100)
								: 0;

						return (
							<div key={entry.category} className="group space-y-1.5 min-w-0">
								<div className="flex items-center justify-between gap-2 text-xs min-w-0">
									<span className="font-bold text-ink group-hover:text-brand-800 transition-colors truncate">
										{entry.category}
									</span>
									<div className="flex items-center gap-2 text-ink-soft font-medium shrink-0">
										<span className="font-mono text-ink-faint">
											{percentage}%
										</span>
										<span className="text-[11px] text-ink-faint">
											({entry.count} {entry.count === 1 ? "item" : "items"})
										</span>
									</div>
								</div>

								{/* Progress Bar Container */}
								<div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2 p-0.5">
									<div
										className="h-full rounded-full bg-linear-to-r from-brand-950 via-brand-800 to-lime-600 transition-all duration-500 group-hover:brightness-110"
										style={{ width: `${Math.max(percentage, 3)}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</motion.section>
	);
};
