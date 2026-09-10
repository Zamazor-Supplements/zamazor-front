import { motion } from "framer-motion";
import { CARD_ANIMATION } from "../../config/motion";
import { type LucideIcon } from "lucide-react";

export type Metric = {
	label: string;
	value: string;
	subtitle: string;
	accent: string;
	icon: LucideIcon;
	alert: boolean;
};

interface MetricCardProps {
	metric: Metric;
	index: number;
}

export const MetricCard = ({ metric, index }: MetricCardProps) => {
	const Icon = metric.icon;

	return (
		<motion.div
			key={metric.label}
			{...CARD_ANIMATION}
			transition={{ duration: 0.25, delay: index * 0.04 }}
			className={`group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md min-w-0 ${
				metric.alert
					? "border-amber-200 ring-1 ring-amber-400/20"
					: "border-brand-900/10"
			}`}
		>
			<div className="flex items-start justify-between gap-3 min-w-0">
				<div className="min-w-0 flex-1">
					<p className="truncate text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
						{metric.label}
					</p>
					<h3 className="mt-1.5 truncate font-mono text-xl sm:text-2xl font-bold tracking-tight text-ink">
						{metric.value}
					</h3>
					<p className="mt-1 truncate text-xs text-ink-soft">
						{metric.subtitle}
					</p>
				</div>

				{/* Icon Badge */}
				<div
					className={`flex size-11 shrink-0 items-center justify-center rounded-lg border ${metric.accent}`}
				>
					<Icon className="size-5 shrink-0" />
				</div>
			</div>

			{/* Subtle Alert Indicator Line for Low Stock */}
			{metric.alert && (
				<span className="absolute inset-x-0 bottom-0 h-1 bg-amber-500" />
			)}
		</motion.div>
	);
};
