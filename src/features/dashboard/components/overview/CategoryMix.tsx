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
			className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header */}
			<div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
				<div className="flex items-center gap-2 min-w-0">
					<div className="rounded-xl bg-emerald-50 p-2 text-emerald-800 shrink-0">
						<LayersIcon className="size-4" />
					</div>
					<h3 className="text-base font-bold text-slate-900 truncate">
						Category Mix
					</h3>
				</div>
				<span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 shrink-0">
					{totalProducts} Total Items
				</span>
			</div>

			{/* Empty State */}
			{categories.length === 0 ? (
				<div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
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
									<span className="font-bold text-slate-800 group-hover:text-emerald-800 transition-colors truncate">
										{entry.category}
									</span>
									<div className="flex items-center gap-2 text-slate-500 font-medium shrink-0">
										<span className="font-mono text-slate-400">
											{percentage}%
										</span>
										<span className="text-[11px] text-slate-400">
											({entry.count} {entry.count === 1 ? "item" : "items"})
										</span>
									</div>
								</div>

								{/* Progress Bar Container */}
								<div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
									<div
										className="h-full rounded-full bg-linear-to-r from-emerald-950 via-emerald-800 to-lime-600 transition-all duration-500 group-hover:brightness-110"
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
