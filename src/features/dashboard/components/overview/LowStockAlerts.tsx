import { motion } from "framer-motion";
import type { LowStockProduct } from "../../schemas/dashboardSchema";
import { CARD_ANIMATION } from "../../config/motion";
import {
	AlertTriangleIcon,
	ArrowRightIcon,
	CheckCircle2Icon,
	PackageXIcon,
} from "lucide-react";
import { APP_ROUTES } from "@/app/routes/paths";
import { Link } from "react-router";

export const LowStockAlerts = ({
	products,
}: {
	products: LowStockProduct[];
}) => {
	const hasLowStock = products.length > 0;

	return (
		<motion.section
			{...CARD_ANIMATION}
			className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs min-w-0"
		>
			{/* Header with Quick Restock Link */}
			<div className="mb-5 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
				<div className="flex items-center gap-2 min-w-0">
					<div
						className={`rounded-xl p-2 shrink-0 ${
							hasLowStock
								? "bg-amber-50 text-amber-700"
								: "bg-emerald-50 text-emerald-800"
						}`}
					>
						{hasLowStock ? (
							<AlertTriangleIcon className="size-4" />
						) : (
							<CheckCircle2Icon className="size-4" />
						)}
					</div>
					<h3 className="text-base font-bold text-slate-900 truncate">
						Low Stock Alerts
					</h3>
				</div>

				{hasLowStock && (
					<Link
						to={APP_ROUTES.DASHBOARD.PRODUCTS}
						className="group flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline shrink-0"
					>
						Restock
						<ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
					</Link>
				)}
			</div>

			{/* Stock List or All-Healthy State */}
			{!hasLowStock ? (
				<div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-emerald-900">
					<CheckCircle2Icon className="size-5 shrink-0 text-emerald-700" />
					<p className="text-xs font-semibold">
						All product stocks are healthy! No immediate restocks needed.
					</p>
				</div>
			) : (
				<div className="space-y-2.5 min-w-0">
					{products.slice(0, 5).map((product) => {
						const stock = product.stockQuantity || 0;
						const isOutOfStock = stock === 0;

						return (
							<div
								key={product.id}
								className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition-colors min-w-0 ${
									isOutOfStock
										? "border-rose-100 bg-rose-50/40"
										: "border-slate-100 bg-slate-50/50 hover:bg-slate-100/60"
								}`}
							>
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-bold text-slate-900">
										{product.name}
									</p>
									<p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
										{product.category}
									</p>
								</div>

								{/* Status Badge */}
								<div
									className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
										isOutOfStock
											? "bg-rose-100 text-rose-800"
											: "bg-amber-100 text-amber-800"
									}`}
								>
									{isOutOfStock ? (
										<>
											<PackageXIcon className="size-3 shrink-0" />
											<span>Out of Stock</span>
										</>
									) : (
										<>
											<span className="size-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
											<span>{stock} left</span>
										</>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</motion.section>
	);
};
