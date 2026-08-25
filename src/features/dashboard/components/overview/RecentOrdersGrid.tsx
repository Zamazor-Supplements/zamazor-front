import { buildShippingAddressString } from "@/features/addresses/utils/addressHelpers";
import { ORDER_STATUS_META } from "@/features/orders/constants/orderStatus";
import type { RecentOrder } from "../../schemas/dashboardSchema";
import { CARD_ANIMATION } from "../../config/motion";
import { motion } from "framer-motion";
import { formatCurrency } from "@/shared/utils/price";
import {
	ArrowRightIcon,
	ArrowUpRightIcon,
	CalendarIcon,
	MapPinIcon,
	PackageOpenIcon,
} from "lucide-react";
import { APP_ROUTES } from "@/app/routes/paths";
import { Link } from "react-router";
import { EmptyState } from "@/shared/components/ui/empty-state";

interface RecentOrdersGridProps {
	orders: RecentOrder[];
	totalOrders: number;
}

export const RecentOrdersGrid = ({
	orders,
	totalOrders,
}: RecentOrdersGridProps) => {
	return (
		<motion.section
			{...CARD_ANIMATION}
			className="flex flex-col justify-between rounded-xl border border-brand-900/10 bg-card p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header */}
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/10 pb-3">
				<div className="min-w-0">
					<h3 className="text-base font-bold text-ink truncate">
						Recent Activity
					</h3>
					<p className="text-xs text-ink-soft">
						Showing latest activity out of {totalOrders} total orders
					</p>
				</div>
				<Link
					to={APP_ROUTES.DASHBOARD.ORDERS}
					className="group flex shrink-0 items-center gap-1 rounded-full border border-brand-900/10 bg-surface-2 px-3 py-1 text-xs font-bold text-ink transition-all hover:border-brand-900/10 hover:bg-surface-2"
				>
					View All
					<ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			{/* Orders Grid */}
			{orders.length === 0 ? (
				<EmptyState
					compact
					icon={PackageOpenIcon}
					title="No recent order activity"
					description="New orders will appear here as soon as customers check out."
					className="min-h-48"
				/>
			) : (
				<div className="grid w-full min-w-0 gap-3.5 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
					{orders.map((order) => {
						const shippingAddress = buildShippingAddressString({
							country: order.shippingCountry,
							street: order.shippingStreet,
							city: order.shippingCity,
							phone: order.phone,
						});
						const meta = ORDER_STATUS_META[order.status];

						return (
							<div
								key={order.id}
								className="group relative flex min-w-0 flex-col justify-between rounded-lg border border-brand-900/10 bg-surface-2/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-900/10 hover:bg-card hover:shadow-md"
							>
								{/* Top Row: Order ID & Status Badge */}
								<div className="min-w-0">
									<div className="flex items-start justify-between gap-2 min-w-0">
										<div className="min-w-0 space-y-0.5 flex-1">
											<span className="block text-[10px] font-bold uppercase tracking-wider text-ink-faint">
												Order Code
											</span>
											<p className="flex items-center gap-1 font-mono text-xs font-bold text-ink min-w-0">
												<span className="truncate">
													#{order.id.slice(0, 8).toUpperCase()}
												</span>
												<ArrowUpRightIcon className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 text-brand-800" />
											</p>
										</div>

										<span
											className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
												meta.badgeClass ?? "bg-surface-2 text-ink"
											}`}
										>
											{meta.label ?? order.status}
										</span>
									</div>

									{/* Customer / Address Summary */}
									<div className="mt-3.5 flex items-start gap-1.5 text-[11px] text-ink-soft min-w-0">
										<MapPinIcon className="size-3.5 shrink-0 text-ink-faint mt-0.5" />
										<p className="line-clamp-2 leading-tight wrap-break-word min-w-0">
											{shippingAddress || "No shipping address provided."}
										</p>
									</div>
								</div>

								{/* Bottom Row: Date & Value */}
								<div className="mt-4 flex items-center justify-between border-t border-brand-900/10 pt-3 text-xs min-w-0">
									<div className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-ink-faint">
										<CalendarIcon className="size-3 shrink-0" />
										<span>
											{order.createdAt.toLocaleDateString(undefined, {
												month: "short",
												day: "numeric",
											})}
										</span>
									</div>
									<span className="shrink-0 font-bold text-ink text-sm">
										{formatCurrency(order.total)}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</motion.section>
	);
};
