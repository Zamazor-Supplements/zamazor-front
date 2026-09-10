import { useMemo } from "react";
import { motion } from "framer-motion";
import { Clock3Icon, ShoppingBagIcon } from "lucide-react";
import { areaY, d3Curve, defineChart, dot, lineY } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts-scales/linear";
import { scalePoint } from "@tanstack/charts-scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart } from "@tanstack/react-charts";
import { curveMonotoneX } from "d3-shape";
import { formatCurrency } from "@/shared/utils/price";
import type { RecentOrder } from "../../schemas/dashboardSchema";
import { CARD_ANIMATION } from "../../config/motion";
import { cn } from "@/lib/utils";

interface SalesChartProps {
	recentOrders: RecentOrder[];
	pending: number;
	completed: number;
	canceled: number;
}

interface DailyRevenueDatum {
	/** Stable `YYYY-MM-DD` key used for reconciliation. */
	key: string;
	/** Short human label, e.g. "Aug 3". */
	label: string;
	/** Sum of order totals placed that day. */
	revenue: number;
	/** Number of orders placed that day. */
	count: number;
}

const COLORS = {
	area: "oklch(0.55 0.13 154)", // brand-600
	line: "oklch(0.38 0.1 156)", // brand-800
	dot: "oklch(0.24 0.06 157)", // brand-950
} as const;

export const SalesChart = ({
	recentOrders,
	pending,
	completed,
	canceled,
}: SalesChartProps) => {
	/** Bin recent orders into contiguous calendar days, oldest first. */
	const dailyRevenue = useMemo<DailyRevenueDatum[]>(() => {
		const byDay = new Map<string, DailyRevenueDatum>();

		for (const order of recentOrders) {
			const date = order.createdAt;
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
			const label = date.toLocaleDateString(undefined, {
				month: "short",
				day: "numeric",
			});

			const current = byDay.get(key) ?? { key, label, revenue: 0, count: 0 };
			current.revenue += order.total;
			current.count += 1;
			byDay.set(key, current);
		}

		return [...byDay.values()].sort((a, b) => a.key.localeCompare(b.key));
	}, [recentOrders]);

	const definition = useMemo(() => {
		return defineChart({
			marks: [
				areaY(dailyRevenue, {
					x: "label",
					y: "revenue",
					fill: COLORS.area,
					fillOpacity: 0.14,
					curve: d3Curve(curveMonotoneX),
				}),

				lineY(dailyRevenue, {
					x: "label",
					y: "revenue",
					stroke: COLORS.line,
					strokeWidth: 2,
					curve: d3Curve(curveMonotoneX),
				}),

				dot(dailyRevenue, {
					x: "label",
					y: "revenue",
					fill: COLORS.dot,
					r: 4,
					stroke: "var(--color-card)",
					strokeWidth: 2,
				}),
			],

			x: {
				scale: () => scalePoint<string>().padding(0.45),
				grid: false,
				axis: {
					tickLabels: { thin: true },
				},
			},

			y: {
				scale: scaleLinear,
				nice: true,
				grid: true,
				axis: {
					ticks: {
						count: 4,
						format: (value: number) => formatCurrency(value),
					},
				},
			},

			focus: "nearest-x",
			maxFocusDistance: Number.POSITIVE_INFINITY,

			tooltip: {
				use: tooltip,
				items: [
					{
						channel: "y",
						label: "Revenue",
						text: (point) => formatCurrency(point.yValue),
					},
					{
						channel: "y",
						label: "Orders",
						text: (point) => String(point.datum.count),
					},
					{
						channel: "x",
						label: "Date",
						text: (point) => point.xValue,
					},
				],
			},
		});
	}, [dailyRevenue]);

	const dayCount = dailyRevenue.length;
	const orderCount = recentOrders.length;

	return (
		<motion.section
			{...CARD_ANIMATION}
			className="flex flex-col justify-between h-full rounded-xl border border-brand-900/10 bg-card p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header */}
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="min-w-0">
					<h3 className="text-base font-bold text-ink truncate">
						Recent Sales Momentum
					</h3>
					<p className="mt-0.5 text-xs text-ink-soft">
						Daily revenue from your most recent orders.
					</p>
				</div>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-brand-900/10 bg-surface-2 px-3 py-1 text-[11px] font-semibold text-ink-soft self-start sm:self-auto">
					<Clock3Icon className="size-3.5 text-ink-faint shrink-0" />
					Last {dayCount} day{dayCount === 1 ? "" : "s"} · {orderCount} order
					{orderCount === 1 ? "" : "s"}
				</span>
			</div>

			{/* Empty State */}
			{orderCount === 0 ? (
				<div className="flex min-h-64 h-full flex-col items-center justify-center rounded-2xl border border-dashed border-brand-900/10 bg-surface-2/50 p-6 text-center">
					<div className="rounded-full bg-surface-2 p-3 text-ink-faint mb-2">
						<ShoppingBagIcon className="size-5" />
					</div>
					<p className="text-xs font-semibold text-ink">
						No Sales Recorded Yet
					</p>
					<p className="mt-1 max-w-xs text-[11px] text-ink-faint">
						Orders will automatically plot here as soon as customers start
						purchasing.
					</p>
				</div>
			) : (
				<div className="space-y-6 min-w-0">
					{/* Chart Area — text-ink-faint feeds currentColor to grid + ticks */}
					<div className="text-ink-faint min-w-0">
						<Chart
							definition={definition}
							height={260}
							className="w-full"
							ariaLabel={`Daily sales revenue for the last ${dayCount} days`}
							ariaDescription="Total revenue per day from the most recent orders."
						/>
					</div>

					{/* Color-Coded Status Counters */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-brand-900/10">
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
		bg: "bg-brand-50/60 border-brand-100",
		dot: "bg-brand-500",
		text: "text-brand-900",
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
			className={cn(
				"rounded-lg border p-3.5 transition-colors min-w-0",
				style.bg,
			)}
		>
			<div className="flex items-center gap-1.5">
				<span className={cn("size-2 rounded-full shrink-0", style.dot)} />
				<p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft truncate">
					{label}
				</p>
			</div>
			<p
				className={`mt-1 text-xl sm:text-lg font-bold tracking-tight ${style.text}`}
			>
				{value}
			</p>
		</div>
	);
};
