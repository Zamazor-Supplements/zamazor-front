import { Button } from "@/shared/components/ui/button";
import { PackageIcon, Trash2Icon } from "lucide-react";
import {
	ORDER_STATUS_META,
	OrderStatus,
} from "@/features/orders/constants/orderStatus";
import { formatCurrency } from "@/shared/utils/price";
import { toAddressString } from "@/features/addresses/utils/addressHelpers";
import type { Order } from "@/features/orders/schemas/orderSchema";
import { cn } from "@/lib/utils";
import { useGetPaymentUrl } from "@/features/orders/services/mutations";

interface ProfileOrderCardProps {
	order: Order;
	onCancel: (order: Order) => void;
}

export const ProfileOrderCard = ({
	order,
	onCancel,
}: ProfileOrderCardProps) => {
	const meta = ORDER_STATUS_META[order.status];
	const isPendingPayment = order.status === OrderStatus.Pending;
	const { mutate: getPaymentUrl, isPending } = useGetPaymentUrl();

	return (
		<div
			className={cn(
				"group rounded-3xl border transition-all duration-300 bg-white shadow-xl shadow-slate-900/5 overflow-hidden w-full min-w-0",
				isPendingPayment
					? "border-emerald-900/30 bg-linear-to-b from-emerald-50/20 via-white to-white ring-2 ring-emerald-900/5"
					: "border-slate-100 hover:border-emerald-900/20",
			)}
		>
			{/* Order Header Bar */}
			<div
				className={cn(
					"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-5 sm:px-8 py-4 sm:py-5 border-b",
					isPendingPayment
						? "border-emerald-900/10 bg-emerald-50/30"
						: "border-slate-100 bg-slate-50/50",
				)}
			>
				<div className="flex items-center gap-3 flex-wrap min-w-0">
					<div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
						<PackageIcon className="size-4 text-emerald-900 shrink-0" />
						<span className="font-mono text-xs font-extrabold tracking-tight text-slate-900 truncate">
							#{order.id.slice(0, 8).toUpperCase()}
						</span>
					</div>
					<span
						className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-2xs ${meta.badgeClass}`}
					>
						{meta.label}
					</span>
				</div>

				<div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/60">
					<div className="text-left sm:text-right">
						<span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">
							Total Due
						</span>
						<span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
							{formatCurrency(order.total)}
						</span>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 min-w-0">
				{/* Order Meta Info */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 border-b border-slate-100 pb-4 min-w-0">
					<div className="flex items-center gap-2 font-semibold">
						<span className="text-slate-400">Placed on:</span>
						<span className="text-slate-700">
							{order.createdAt.toLocaleDateString("en-US", {
								dateStyle: "long",
							})}
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-medium min-w-0 max-w-full">
						<span className="text-slate-400 font-semibold shrink-0">
							Destination:
						</span>
						<span className="text-slate-700 truncate">
							{toAddressString({
								country: order.shippingCountry,
								city: order.shippingCity,
								street: order.shippingStreet,
								phone: order.phone,
							}) || "Standard Delivery"}
						</span>
					</div>
				</div>

				{/* Items Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
					{order.items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-colors hover:bg-slate-50 min-w-0 overflow-hidden"
						>
							<div className="flex items-center gap-3 min-w-0 flex-1">
								<div className="size-10 sm:size-11 rounded-xl bg-white border border-slate-200/80 text-emerald-900 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
									{item.quantity}x
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
										{item.product.name}
									</p>
									<span className="text-[11px] font-medium text-slate-400 truncate block">
										{formatCurrency(item.product.price)} each
									</span>
								</div>
							</div>
							<span className="font-black text-slate-900 text-xs sm:text-sm shrink-0 pl-2">
								{formatCurrency(item.product.price * item.quantity)}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Footer Actions Bar */}
			<div
				className={cn(
					"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 sm:px-8 py-4 sm:py-5 border-t",
					isPendingPayment
						? "border-emerald-900/10 bg-emerald-50/20"
						: "border-slate-100 bg-slate-50/50",
				)}
			>
				<div className="text-xs text-slate-500 font-medium">
					{isPendingPayment ? (
						<span className="text-emerald-900 font-bold flex items-center gap-1.5">
							<span className="size-2 rounded-full bg-emerald-700 animate-ping shrink-0" />
							Action required: Complete your payment to process this order.
						</span>
					) : (
						<span>
							Need assistance? Contact our support team referencing this order
							ID.
						</span>
					)}
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
					{isPendingPayment && (
						<Button
							onClick={() => getPaymentUrl(order.id)}
							disabled={isPending}
							className="h-11 w-full sm:w-auto rounded-2xl bg-emerald-900 px-6 text-xs font-bold tracking-wide text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-950 transition-all hover:scale-[1.02] cursor-pointer"
						>
							{isPending ? "Redirecting..." : "Proceed to Payment"}
						</Button>
					)}

					{order.status === "PENDING" && (
						<Button
							type="button"
							variant="outline"
							onClick={() => onCancel(order)}
							className="h-11 w-full sm:w-auto rounded-2xl border-rose-200/80 px-5 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-xs cursor-pointer"
						>
							<Trash2Icon className="mr-2 size-4 shrink-0" />
							Cancel Order
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
