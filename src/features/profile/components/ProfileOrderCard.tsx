import { Button } from "@/shared/components/ui/button";
import {
	Loader2Icon,
	PackageIcon,
	RotateCcwIcon,
	Trash2Icon,
} from "lucide-react";
import { useReorder } from "@/features/cart/services/mutations";
import {
	ORDER_STATUS_META,
	OrderStatus,
} from "@/features/orders/constants/orderStatus";
import { formatPrice } from "@/shared/utils/price";
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
	const reorderMutation = useReorder();
	const isReordering = reorderMutation.isPending;

	const canReorder =
		order.status === OrderStatus.Delivered ||
		order.status === OrderStatus.Canceled;

	const handleReorder = () => {
		reorderMutation.mutate(
			order.items.map((item) => ({
				productId: item.product.id,
				quantity: item.quantity,
			})),
		);
	};

	return (
		<div
			className={cn(
				"group rounded-md border transition-all duration-300 bg-card shadow-xl shadow-brand-950/5 overflow-hidden w-full min-w-0",
				isPendingPayment
					? "border-brand-900/30 bg-linear-to-b from-brand-50/20 via-card to-card ring-2 ring-brand-900/5"
					: "border-brand-900/10 hover:border-brand-900/20",
			)}
		>
			{/* Order Header Bar */}
			<div
				className={cn(
					"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-5 sm:px-8 py-4 sm:py-5 border-b",
					isPendingPayment
						? "border-brand-900/10 bg-brand-50/30"
						: "border-brand-900/10 bg-surface-2/50",
				)}
			>
				<div className="flex items-center gap-3 flex-wrap min-w-0">
					<div className="flex items-center gap-2 bg-card px-3.5 py-1.5 rounded-md border border-brand-900/10/80 shadow-xs">
						<PackageIcon className="size-4 text-brand-900 shrink-0" />
						<span className="font-mono text-xs font-extrabold tracking-tight text-ink truncate">
							#{order.id.slice(0, 8).toUpperCase()}
						</span>
					</div>
					<span
						className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-2xs ${meta.badgeClass}`}
					>
						{meta.label}
					</span>
				</div>

				<div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-900/10/60">
					<div className="text-left sm:text-right">
						<span className="text-[10px] text-ink-faint uppercase font-black tracking-widest block">
							Total Due
						</span>
						<span className="text-base sm:text-lg font-black text-ink tracking-tight">
							{formatPrice(order.total)}
						</span>
					</div>
				</div>
			</div>
			{/* Main Content Area */}
			<div className="px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6 min-w-0">
				{/* Order Meta Info */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs text-ink-soft border-b border-brand-900/10 pb-4 min-w-0">
					<div className="flex items-center gap-2 font-semibold">
						<span className="text-ink-faint">Placed on:</span>
						<span className="text-ink">
							{order.createdAt.toLocaleDateString("en-US", {
								dateStyle: "long",
							})}
						</span>
					</div>
					<div className="flex items-center gap-1.5 font-medium min-w-0 max-w-full">
						<span className="text-ink-faint font-semibold shrink-0">
							Destination:
						</span>
						<span className="text-ink truncate">
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
							className="flex items-center justify-between gap-3 rounded-md border border-brand-900/10 bg-surface-2/50 p-3.5 transition-colors hover:bg-surface-2 min-w-0 overflow-hidden"
						>
							<div className="flex items-center gap-3 min-w-0 flex-1">
								<div className="size-10 sm:size-11 rounded-lg bg-card border border-brand-900/10/80 text-brand-900 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs">
									{item.quantity}x
								</div>
								<div className="min-w-0 flex-1">
									<p className="font-bold text-ink text-xs sm:text-sm truncate">
										{item.product.name}
									</p>
									<span className="text-[11px] font-medium text-ink-faint truncate block">
										{formatPrice(item.product.price)} each
									</span>
								</div>
							</div>
							<span className="font-black text-ink text-xs sm:text-sm shrink-0 pl-2">
								{formatPrice(item.product.price * item.quantity)}
							</span>
						</div>
					))}
				</div>
			</div>
			{/* Footer Actions Bar */}
			{/* Footer Actions Bar */}
			<div
				className={cn(
					"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 sm:px-8 py-4 sm:py-5 border-t transition-colors",
					isPendingPayment
						? "border-brand-900/10 bg-brand-50/30"
						: "border-brand-900/10 bg-surface-2/40",
				)}
			>
				{/* Status / Support Text */}
				<div className="text-xs sm:text-sm text-ink-soft font-medium">
					{isPendingPayment ? (
						<span className="text-brand-900 font-semibold flex items-center gap-2">
							<span className="relative flex size-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-700 opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-brand-800" />
							</span>
							Action required: Complete your payment to process this order.
						</span>
					) : (
						<span>
							Need assistance? Contact our support team referencing this order
							ID.
						</span>
					)}
				</div>

				{/* Action Buttons Group */}
				<div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-end">
					{/* Cancel Order (Secondary / Destructive) */}
					{order.status === "PENDING" && (
						<Button
							type="button"
							variant="ghost"
							onClick={() => onCancel(order)}
							className="h-10 w-full sm:w-auto rounded-lg px-4 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
						>
							<Trash2Icon className="mr-1.5 size-4 shrink-0" />
							Cancel Order
						</Button>
					)}

					{/* Reorder Action */}
					{canReorder && (
						<Button
							type="button"
							variant="outline"
							onClick={handleReorder}
							disabled={isReordering}
							className="h-10 w-full sm:w-auto rounded-lg border-brand-900/15 bg-white px-4 text-xs font-semibold text-brand-900 hover:bg-brand-50/50 hover:border-brand-900/30 transition-all shadow-2xs cursor-pointer"
						>
							{isReordering ? (
								<Loader2Icon className="mr-1.5 size-4 shrink-0 animate-spin" />
							) : (
								<RotateCcwIcon className="mr-1.5 size-4 shrink-0" />
							)}
							{isReordering ? "Reordering..." : "Reorder"}
						</Button>
					)}

					{/* Primary Payment Action */}
					{isPendingPayment && (
						<Button
							onClick={() => getPaymentUrl(order.id)}
							disabled={isPending}
							className="h-10 w-full sm:w-auto rounded-lg bg-brand-900 px-5 text-xs font-semibold tracking-wide text-white shadow-md shadow-brand-900/15 hover:bg-brand-950 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
						>
							{isPending && (
								<Loader2Icon className="size-4 shrink-0 animate-spin" />
							)}
							{isPending ? "Redirecting..." : "Proceed to Payment"}
						</Button>
					)}
				</div>
			</div>{" "}
		</div>
	);
};
