import { motion } from "framer-motion";
import { CARD_ANIMATION } from "../../config/motion";
import { type LucideIcon } from "lucide-react";

// interface MetricCardProps {
// 	metric: {
// 		label: string;
// 		value: string;
// 		icon: LucideIcon;
// 		accent: string;
// 	};
// 	index: number;
// }

// export const MetricCard = ({ metric, index }: MetricCardProps) => {
// 	const Icon = metric.icon;
// 	// const hasChange = typeof metric.change === "number";
// 	// const isPositive = hasChange && (metric.change ?? 0) >= 0;

// 	return (
// 		<motion.div
// 			{...CARD_ANIMATION}
// 			transition={{ duration: 0.35, delay: index * 0.05 }}
// 			className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
// 		>
// 			{/* Top Header: Label & Icon */}
// 			<div className="flex items-start justify-between gap-3">
// 				<span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
// 					{metric.label}
// 				</span>
// 				<div
// 					className={`grid size-10 shrink-0 place-items-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${metric.accent}`}
// 				>
// 					<Icon className="size-5" />
// 				</div>
// 			</div>

// 			{/* Main Metric Value */}
// 			<div className="mt-3">
// 				<h3 className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
// 					{metric.value}
// 				</h3>
// 			</div>

// 			{/* Optional Trend Indicator / Subtext */}
// 			{/*
// 			// Todo: Add the change pourcentage
// 			{hasChange && (
//         <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-slate-100">
//           <span
//             className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
//               isPositive
//                 ? "bg-emerald-50 text-emerald-700"
//                 : "bg-rose-50 text-rose-700"
//             }`}
//           >
//             {isPositive ? (
//               <TrendingUpIcon className="size-3" />
//             ) : (
//               <TrendingDownIcon className="size-3" />
//             )}
//             {isPositive ? `+${metric.change}%` : `${metric.change}%`}
//           </span>
//           {metric.changeLabel && (
//             <span className="text-[11px] font-medium text-slate-400">
//               {metric.changeLabel}
//             </span>
//           )}
//         </div>
//       )} */}
// 		</motion.div>
// 	);
// };

interface MetricCardProps {
	metric: {
		label: string;
		value: string;
		subtitle: string;
		accent: string;
		icon: LucideIcon;
		alert: boolean;
	};
	index: number;
}

export const MetricCard = ({ metric, index }: MetricCardProps) => {
	const Icon = metric.icon;

	return (
		<motion.div
			key={metric.label}
			{...CARD_ANIMATION}
			transition={{ duration: 0.25, delay: index * 0.04 }}
			className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md min-w-0 ${
				metric.alert
					? "border-amber-200 ring-1 ring-amber-400/20"
					: "border-slate-200/80"
			}`}
		>
			<div className="flex items-start justify-between gap-3 min-w-0">
				<div className="min-w-0 flex-1">
					<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
						{metric.label}
					</p>
					<h3 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono truncate">
						{metric.value}
					</h3>
					<p className="mt-1 text-xs text-slate-500 truncate">
						{metric.subtitle}
					</p>
				</div>

				{/* Icon Badge */}
				<div
					className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${metric.accent}`}
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
