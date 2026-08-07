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
			className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs min-w-0"
		>
			{/* Left: Greeting & Primary Context */}
			<div className="space-y-2 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 truncate">
						Command Center
					</h1>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
						<span className="size-1.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
						Live Sync
					</span>
				</div>
				<p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
					Real-time tracking of sales velocity, inventory health, and active
					fulfillment queues.
				</p>
			</div>

			{/* Right: Quick Stat Ticker & Action Pills */}
			<div className="flex flex-wrap items-center gap-4 shrink-0">
				{/* Quick Compact Metric Ticker */}
				<div className="hidden sm:flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-2">
					<div>
						<span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
							In-Flight
						</span>
						<span className="text-sm font-black text-slate-900 font-mono">
							{data.inFlightOrders}
						</span>
					</div>
					<div className="h-6 w-px bg-slate-200" />
					<div>
						<span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
							Low Stock
						</span>
						<span
							className={`text-sm font-black font-mono ${hasLowStock ? "text-amber-600" : "text-slate-900"}`}
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
						className="h-10 rounded-xl border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
					>
						<Link to={APP_ROUTES.DASHBOARD.PRODUCTS}>
							<PackageIcon className="mr-1.5 size-3.5 text-slate-400 shrink-0" />
							Products
						</Link>
					</Button>

					<Button
						asChild
						className="h-10 rounded-xl bg-emerald-900 px-5 text-xs font-bold text-white shadow-sm shadow-emerald-900/20 hover:bg-emerald-950 transition-all hover:scale-[1.02] cursor-pointer"
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
