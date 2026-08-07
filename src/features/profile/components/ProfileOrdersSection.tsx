import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { APP_ROUTES } from "@/app/routes/paths";
import { ProfileOrderCard } from "./ProfileOrderCard";
import type { Order } from "@/features/orders/schemas/orderSchema";
import type { OrderPage } from "@/features/orders/schemas/orderSchema";
import { useLanguage } from "@/shared/hooks/use-language";

interface ProfileOrdersSectionProps {
	orderPage?: OrderPage | undefined;
	isPending: boolean;
	onCancelOrder: (order: Order) => void;
}

export const ProfileOrdersSection = ({
	orderPage,
	isPending,
	onCancelOrder,
}: ProfileOrdersSectionProps) => {
	const { t } = useLanguage();

	if (isPending || !orderPage) {
		return (
			<div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-10 shadow-2xl shadow-slate-900/5 backdrop-blur-xl">
				<div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center px-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-900 mb-4 shadow-sm ring-1 ring-emerald-900/10">
						<Loader2 className="size-6 animate-spin text-emerald-900" />
					</div>
					<h3 className="font-playfair text-base sm:text-lg font-bold text-slate-900">
						Loading your orders
					</h3>
					<p className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
						Please wait while we sync your latest purchases...
					</p>
				</div>
			</div>
		);
	}

	if (orderPage.items.length === 0) {
		return (
			<div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-10 shadow-2xl shadow-slate-900/5">
				<div className="border-b border-slate-100 pb-6 mb-8">
					<h2 className="font-playfair text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
						{t("profile.ordersHistory")}
					</h2>
					<p className="text-xs sm:text-sm text-slate-400 mt-1">
						Track your active orders and review purchase history.
					</p>
				</div>

				<div className="text-center py-16 sm:py-20 px-4">
					<div className="size-20 rounded-3xl bg-emerald-50 text-emerald-900 flex items-center justify-center mx-auto mb-5 shadow-inner ring-1 ring-emerald-900/10">
						<ShoppingBag className="size-8" />
					</div>
					<h3 className="font-playfair text-lg sm:text-xl font-bold text-slate-900">
						{t("profile.emptyOrders")}
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
						You haven't placed any orders yet. Discover our formulas and start
						building your routine!
					</p>
					<Button
						asChild
						className="mt-8 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl px-8 h-12 sm:h-14 font-bold shadow-lg shadow-emerald-900/25 transition-all hover:scale-[1.02] cursor-pointer"
					>
						<Link to={APP_ROUTES.SHOP}>Explore Formulas</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 lg:p-10 shadow-2xl shadow-slate-900/5">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 mb-6 sm:mb-8 gap-4">
				<div>
					<h2 className="font-playfair text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
						{t("profile.ordersHistory")}
					</h2>
					<p className="text-xs sm:text-sm text-slate-400 mt-1">
						Manage your shipments, track fulfillment status, and clear pending
						balances.
					</p>
				</div>
				<div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-2.5 self-start sm:self-auto shadow-xs">
					<span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
					<span className="text-xs font-bold text-slate-700">
						{orderPage.items.length}{" "}
						{orderPage.items.length === 1 ? "Order" : "Orders"} Total
					</span>
				</div>
			</div>

			<div className="space-y-4 sm:space-y-6">
				{orderPage.items.map((order) => (
					<ProfileOrderCard
						key={order.id}
						order={order}
						onCancel={onCancelOrder}
					/>
				))}
			</div>
		</div>
	);
};
