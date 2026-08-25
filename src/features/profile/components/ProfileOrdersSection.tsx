import { Loader2Icon, ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { APP_ROUTES } from "@/app/routes/paths";
import { ProfileOrderCard } from "./ProfileOrderCard";
import type { Order } from "@/features/orders/schemas/orderSchema";
import { useLanguage } from "@/shared/hooks/use-language";
import { useMyOrders } from "@/features/orders/services/queries";
import { ErrorFallback } from "@/shared/components/ui/error-fallback";

interface ProfileOrdersSectionProps {
	onCancelOrder: (order: Order) => void;
}

export const ProfileOrdersSection = ({
	onCancelOrder,
}: ProfileOrdersSectionProps) => {
	const { t } = useLanguage();
	const { data: orderPage, isPending, isError, refetch } = useMyOrders();

	if (isPending || !orderPage) {
		return (
			<div className="rounded-3xl border border-brand-900/10 bg-card p-6 sm:p-10 shadow-2xl shadow-brand-950/5 backdrop-blur-xl">
				<div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center px-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-900 mb-4 shadow-sm ring-1 ring-brand-900/10">
						<Loader2Icon className="size-6 animate-spin text-brand-900" />
					</div>
					<h3 className="font-playfair text-base sm:text-lg font-bold text-ink">
						Loading your orders
					</h3>
					<p className="mt-1 text-xs sm:text-sm text-ink-faint font-medium">
						Please wait while we sync your latest purchases...
					</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<ErrorFallback
				title="Failed to load orders"
				description="Something went wrong while fetching orders."
				onRetry={() => refetch()}
			/>
		);
	}

	if (orderPage.items.length === 0) {
		return (
			<div className="rounded-3xl border border-brand-900/10 bg-card p-6 sm:p-10 shadow-2xl shadow-brand-950/5">
				<div className="border-b border-brand-900/10 pb-6 mb-8">
					<h2 className="font-playfair text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
						{t("profile.ordersHistory")}
					</h2>
					<p className="text-xs sm:text-sm text-ink-faint mt-1">
						Track your active orders and review purchase history.
					</p>
				</div>

				<div className="text-center py-16 sm:py-20 px-4">
					<div className="size-20 rounded-3xl bg-brand-50 text-brand-900 flex items-center justify-center mx-auto mb-5 shadow-inner ring-1 ring-brand-900/10">
						<ShoppingBagIcon className="size-8" />
					</div>
					<h3 className="font-playfair text-lg sm:text-xl font-bold text-ink">
						{t("profile.emptyOrders")}
					</h3>
					<p className="mt-2 text-xs sm:text-sm text-ink-soft max-w-sm mx-auto font-medium leading-relaxed">
						You haven't placed any orders yet. Discover our formulas and start
						building your routine!
					</p>
					<Button
						asChild
						className="mt-8 px-8 h-5 sm:h-14 font-bold shadow-lg cursor-pointer"
					>
						<Link to={APP_ROUTES.SHOP}>Explore Formulas</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-3xl border border-brand-900/10 bg-card p-5 sm:p-8 lg:p-10 shadow-2xl shadow-brand-950/5">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-900/10 pb-6 mb-6 sm:mb-8 gap-4">
				<div>
					<h2 className="font-playfair text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
						{t("profile.ordersHistory")}
					</h2>
					<p className="text-xs sm:text-sm text-ink-faint mt-1">
						Manage your shipments, track fulfillment status, and clear pending
						balances.
					</p>
				</div>
				<div className="inline-flex items-center gap-2 rounded-2xl bg-surface-2 border border-brand-900/10 px-4 py-2.5 self-start sm:self-auto shadow-xs">
					<span className="size-2 rounded-full bg-brand-600 animate-pulse" />
					<span className="text-xs font-bold text-ink">
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
