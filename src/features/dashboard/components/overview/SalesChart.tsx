import { formatCurrency } from "@/shared/utils/price";
import { motion } from "framer-motion";
import { Clock3Icon, ShoppingBagIcon } from "lucide-react";
import { useMemo } from "react";
import type { RecentOrder } from "../../schemas/dashboardSchema";
import { CARD_ANIMATION } from "../../config/motion";

interface SalesChartProps {
	recentOrders: RecentOrder[];
	pending: number;
	completed: number;
	canceled: number;
}

export const SalesChart = ({
	recentOrders,
	pending,
	completed,
	canceled,
}: SalesChartProps) => {
	const salesRun = useMemo(() => {
		return [...(recentOrders || [])].reverse();
	}, [recentOrders]);

	const maxAmount = useMemo(() => {
		if (salesRun.length === 0) return 1;
		return Math.max(...salesRun.map((order) => order.total));
	}, [salesRun]);

	return (
		<motion.section
			{...CARD_ANIMATION}
			className="flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header */}
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="min-w-0">
					<h3 className="text-base font-bold text-slate-900 truncate">
						Recent Sales Momentum
					</h3>
					<p className="mt-0.5 text-xs text-slate-500">
						Revenue sequence from your most recent orders.
					</p>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600 self-start sm:self-auto">
					<Clock3Icon className="size-3.5 text-slate-400 shrink-0" />
					Last {salesRun.length} orders
				</span>
			</div>

			{/* Empty State */}
			{salesRun.length === 0 ? (
				<div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
					<div className="rounded-full bg-slate-100 p-3 text-slate-400 mb-2">
						<ShoppingBagIcon className="size-5" />
					</div>
					<p className="text-xs font-semibold text-slate-700">
						No Sales Recorded Yet
					</p>
					<p className="mt-1 max-w-xs text-[11px] text-slate-400">
						Orders will automatically plot here as soon as customers start
						purchasing.
					</p>
				</div>
			) : (
				<div className="space-y-6 min-w-0">
					{/* Chart Area with Gridlines - Added pt-12 and overflow-visible to prevent cutting off top tooltips */}
					<div className="relative flex h-60 w-full items-end gap-1.5 sm:gap-2.5 pt-12 pb-2 overflow-x-auto overflow-y-visible">
						{/* Background Axis Lines */}
						<div className="pointer-events-none absolute inset-x-0 top-12 bottom-6 flex flex-col justify-between opacity-40">
							<div className="border-b border-dashed border-slate-200 w-full" />
							<div className="border-b border-dashed border-slate-200 w-full" />
							<div className="border-b border-dashed border-slate-200 w-full" />
						</div>

						{salesRun.map((order) => {
							const barHeight = Math.max(10, (order.total / maxAmount) * 100);

							return (
								<div
									key={order.id}
									className="group relative flex h-full flex-1 flex-col items-center justify-end min-w-7"
								>
									{/* Hover Floating Tooltip - Adjusted positioning to stay fully visible */}
									<div className="pointer-events-none absolute -top-10 z-30 flex flex-col items-center opacity-0 transition-all duration-200 group-hover:-top-11 group-hover:opacity-100">
										<span className="whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md">
											{formatCurrency(order.total)}
										</span>
										<div className="size-1.5 rotate-45 bg-slate-900 -mt-1" />
									</div>

									{/* Bar */}
									<div
										className="w-full max-w-10 rounded-t-xl bg-linear-to-t from-emerald-950 via-emerald-800 to-emerald-600 transition-all duration-300 group-hover:scale-x-105 group-hover:from-emerald-900 group-hover:to-lime-500 group-hover:shadow-md"
										style={{ height: `${barHeight}%` }}
									/>

									{/* Order ID Label */}
									<span className="mt-2 w-full truncate text-center font-mono text-[10px] font-medium text-slate-400 group-hover:text-slate-700">
										#{order.id.slice(0, 6).toUpperCase()}
									</span>
								</div>
							);
						})}
					</div>

					{/* Color-Coded Status Counters */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
						<StatusBadge label="Pending" value={pending} variant="warning" />
						<StatusBadge
							label="Completed"
							value={completed}
							variant="success"
						/>
						<StatusBadge label="Canceled" value={canceled} variant="danger" />
					</div>
				</div>
			)}
		</motion.section>
	);
};

interface StatusBadgeProps {
	label: string;
	value: number;
	variant: "warning" | "success" | "danger";
}

const variantStyles = {
	warning: {
		bg: "bg-amber-50/60 border-amber-100",
		dot: "bg-amber-500",
		text: "text-amber-900",
	},
	success: {
		bg: "bg-emerald-50/60 border-emerald-100",
		dot: "bg-emerald-500",
		text: "text-emerald-900",
	},
	danger: {
		bg: "bg-rose-50/60 border-rose-100",
		dot: "bg-rose-500",
		text: "text-rose-900",
	},
};

const StatusBadge = ({ label, value, variant }: StatusBadgeProps) => {
	const style = variantStyles[variant];

	return (
		<div
			className={`rounded-2xl border p-3.5 transition-colors ${style.bg} min-w-0`}
		>
			<div className="flex items-center gap-1.5">
				<span className={`size-2 rounded-full shrink-0 ${style.dot}`} />
				<p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
					{label}
				</p>
			</div>
			<p
				className={`mt-1 text-xl sm:text-2xl font-bold tracking-tight ${style.text}`}
			>
				{value}
			</p>
		</div>
	);
};
