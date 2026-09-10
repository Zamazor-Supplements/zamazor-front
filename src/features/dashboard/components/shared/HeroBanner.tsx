import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon, PackageIcon } from "lucide-react";
import { Link } from "react-router";
import { CARD_ANIMATION } from "../../config/motion";
import type { DashboardOverview } from "../../schemas/dashboardSchema";

export const HeroBanner = ({ data }: { data: DashboardOverview }) => {
	const hasLowStock = data.lowStockProducts.length > 0;

	return (
		<motion.section
			{...CARD_ANIMATION}
			className="flex min-w-0 flex-col justify-between gap-6 rounded-xl border border-brand-900/10 bg-card p-6 shadow-xs xl:flex-row xl:items-center sm:p-8"
		>
			{/* Left: Greeting & Primary Context */}
			<div className="space-y-2 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<h1 className="truncate text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
						Command Center
					</h1>
					<span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-800">
						<span className="size-1.5 shrink-0 animate-ping rounded-full bg-brand-600" />
						Live Sync
					</span>
				</div>
				<p className="max-w-xl text-xs font-medium leading-relaxed text-ink-soft sm:text-sm">
					Real-time tracking of sales velocity, inventory health, and active
					fulfillment queues.
				</p>
			</div>

			{/* Right: Quick Stat Ticker & Action Pills */}
			<div className="flex flex-wrap items-center gap-4 shrink-0">
				{/* Quick Compact Metric Ticker */}
				<div className="hidden items-center gap-4 rounded-lg border border-brand-900/10 bg-surface-2/70 px-4 py-2 sm:flex">
					<div>
						<span className="block text-[10px] font-bold uppercase tracking-wider text-ink-faint">
							In-Flight
						</span>
						<span className="font-mono text-sm font-black text-ink">
							{data.inFlightOrders}
						</span>
					</div>
					<div className="h-6 w-px bg-brand-900/10" />
					<div>
						<span className="block text-[10px] font-bold uppercase tracking-wider text-ink-faint">
							Low Stock
						</span>
						<span
							className={`font-mono text-sm font-black ${hasLowStock ? "text-amber-600" : "text-ink"}`}
						>
							{data.lowStockProducts.length}
						</span>
					</div>
				</div>

				{/* Action Shortcuts */}
				<div className="flex items-center gap-2.5 flex-wrap">
					<Button
						asChild
						variant="outline"
						className="h-10 rounded-lg border-brand-900/10 bg-card px-4 text-xs font-bold text-ink shadow-2xs transition-all hover:bg-surface-2 hover:text-ink cursor-pointer"
					>
						<Link to={APP_ROUTES.DASHBOARD.PRODUCTS}>
							<PackageIcon className="mr-1.5 size-3.5 shrink-0 text-ink-faint" />
							Products
						</Link>
					</Button>

					<Button
						asChild
						className="h-10 px-5 text-xs cursor-pointer"
					>
						<Link to={APP_ROUTES.DASHBOARD.ORDERS}>
							View Orders
							<ArrowRightIcon className="ml-1.5 size-3.5 shrink-0" />
						</Link>
					</Button>
				</div>
			</div>
		</motion.section>
	);
};
