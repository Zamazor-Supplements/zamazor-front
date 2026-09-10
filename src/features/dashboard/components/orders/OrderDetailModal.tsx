import {
	AlertTriangleIcon,
	MapPinIcon,
	CalendarIcon,
	PackageIcon,
	CreditCardIcon,
	PhoneIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Order } from "@/features/orders/schemas/orderSchema";
import type { OrderStatus } from "@/features/orders/constants/orderStatus";
import {
	ORDER_STATUS_META,
	isFinalOrderStatus,
} from "@/features/orders/constants/orderStatus";
import { formatCurrency } from "@/shared/utils/price";
import { buildShippingAddressString } from "@/features/addresses/utils/addressHelpers";
import { OrderStatusSelect } from "./OrderStatusSelect";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";

type OrderDetailModalProps = {
	order: Order;
	updatingStatusOrderId: string | null;
	onClose: () => void;
	onChangeStatus: (orderId: string, status: OrderStatus) => void;
	onRefundOrder: (orderId: string) => void;
};

export const OrderDetailModal = ({
	order,
	updatingStatusOrderId,
	onClose,
	onChangeStatus,
	onRefundOrder,
}: OrderDetailModalProps) => {
	const canChangeStatus = !isFinalOrderStatus(order.status);
	const meta = ORDER_STATUS_META[order.status];
	const shippingAddress = buildShippingAddressString({
		city: order.shippingCity,
		country: order.shippingCountry,
		phone: order.phone,
		street: order.shippingStreet,
	});

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[92vw] max-w-2xl sm:max-w-2xl max-h-10/12 overflow-y-auto overflow-x-hidden rounded-xl p-0 border border-brand-900/10 shadow-2xl bg-card [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand-900/15 hover:[&::-webkit-scrollbar-thumb]:bg-brand-900/30">
				{/* Header */}
				<DialogHeader className="p-5 sm:p-6 pb-4 border-b border-brand-900/10 bg-surface-2/20">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div className="min-w-0 flex-1 space-y-0.5">
							<span className="font-sans text-[10px] font-semibold tracking-wider text-ink-faint uppercase">
								Order Overview
							</span>
							<DialogTitle className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-ink truncate">
								Order #{order.id.slice(0, 8).toUpperCase()}
							</DialogTitle>
						</div>
						<Badge
							variant="outline"
							className={cn(
								"w-fit shrink-0 px-2.5 py-0.5 font-sans text-[11px] font-semibold tracking-wide uppercase",
								meta.badgeClass,
							)}
						>
							{meta.label}
						</Badge>
					</div>
				</DialogHeader>

				{/* Content Body */}
				<div className="p-4 sm:p-6 space-y-5 overflow-x-hidden font-sans">
					{/* Shipping & Order Metadata Grid */}
					<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
						{/* Shipping Details Card */}
						<div className="bg-white rounded-lg border border-brand-900/10 p-4 shadow-2xs space-y-3 min-w-0">
							<div className="flex items-center gap-2 border-b border-brand-900/10 pb-2.5">
								<div className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
									<MapPinIcon className="size-3.5" />
								</div>
								<h4 className="font-sans text-xs font-semibold tracking-tight text-ink truncate">
									Shipping Information
								</h4>
							</div>

							<div className="space-y-3 text-xs min-w-0">
								<div className="grid grid-cols-2 gap-2 min-w-0">
									<div className="min-w-0">
										<span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-ink-faint block mb-0.5">
											Street
										</span>
										<p className="font-sans text-xs font-medium text-ink truncate">
											{order.shippingStreet}
										</p>
									</div>
									<div className="min-w-0">
										<span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-ink-faint block mb-0.5">
											City
										</span>
										<p className="font-sans text-xs font-medium text-ink truncate">
											{order.shippingCity}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 min-w-0">
									<div className="min-w-0">
										<span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-ink-faint block mb-0.5">
											Country
										</span>
										<p className="font-sans text-xs font-medium text-ink truncate">
											{order.shippingCountry}
										</p>
									</div>
									<div className="min-w-0">
										<span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-ink-faint block mb-0.5">
											Phone
										</span>
										<p className="font-sans text-xs font-medium text-ink truncate flex items-center gap-1">
											<PhoneIcon className="size-3 text-brand-700 shrink-0" />
											<span className="truncate">{order.phone}</span>
										</p>
									</div>
								</div>

								<div className="pt-2.5 border-t border-slate-100 min-w-0">
									<span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-ink-faint block mb-1">
										Full Delivery Address
									</span>
									<p className="font-sans text-[11px] font-normal text-ink/80 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 wrap-break-word">
										{shippingAddress}
									</p>
								</div>
							</div>
						</div>

						{/* Order Metadata Card */}
						<div className="bg-white rounded-lg border border-brand-900/10 p-4 shadow-2xs space-y-3 flex flex-col justify-between min-w-0">
							<div className="min-w-0">
								<div className="flex items-center gap-2 border-b border-brand-900/10 pb-2.5 mb-3">
									<div className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
										<CalendarIcon className="size-3.5" />
									</div>
									<h4 className="font-sans text-xs font-semibold tracking-tight text-ink truncate">
										Metadata & Total
									</h4>
								</div>

								<div className="space-y-2.5 text-xs min-w-0">
									<div className="min-w-0">
										<span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-ink-faint block mb-0.5">
											Date Placed
										</span>
										<p className="font-sans text-xs font-medium text-ink truncate">
											{order.createdAt.toLocaleString(undefined, {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</p>
									</div>
								</div>
							</div>

							<div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-2 min-w-0">
								<span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-ink-faint flex items-center gap-1.5 shrink-0">
									<CreditCardIcon className="size-3.5 text-brand-700" />
									Total Amount
								</span>
								<span className="font-sans text-base sm:text-lg font-bold tracking-tight text-ink truncate">
									{formatCurrency(order.total ?? 0)}
								</span>
							</div>
						</div>
					</div>

					{/* Ordered Items Section */}
					<div className="space-y-2.5 min-w-0">
						<h4 className="font-sans text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
							Ordered Items ({order.items.length})
						</h4>
						<div className="overflow-hidden rounded-lg border border-brand-900/10 bg-white divide-y divide-slate-100 shadow-2xs min-w-0">
							{order.items.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between gap-3 p-3 text-xs hover:bg-slate-50/50 transition-colors min-w-0"
								>
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-50 border border-slate-100 shadow-2xs">
											<PackageIcon className="size-4 text-brand-800" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="font-sans text-xs font-semibold text-ink truncate">
												{item.product?.name || "Unknown Product"}
											</p>
											<p className="font-sans text-[11px] font-medium text-ink-faint mt-0.5">
												Qty:{" "}
												<span className="font-semibold text-ink">
													{item.quantity}
												</span>
											</p>
										</div>
									</div>
									<span className="font-sans text-xs font-bold text-ink shrink-0">
										{formatCurrency(item.product.price * item.quantity)}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<DialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 border-t border-brand-900/10 p-4 sm:px-6 bg-surface-2/20">
					<div className="w-full sm:w-auto">
						<OrderStatusSelect
							orderId={order.id}
							currentStatus={order.status}
							isUpdating={updatingStatusOrderId === order.id}
							onStatusChange={onChangeStatus}
						/>
					</div>

					<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
						{canChangeStatus && (
							<Button
								variant="outline"
								onClick={() => onRefundOrder(order.id)}
								className="h-9 rounded-lg border-rose-200 px-3.5 font-sans text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
							>
								<AlertTriangleIcon className="mr-1.5 size-3.5" />
								Refund Order
							</Button>
						)}
						<Button
							onClick={onClose}
							className="h-9 rounded-lg bg-brand-900 px-4 font-sans text-xs font-medium text-white hover:bg-brand-950 cursor-pointer"
						>
							Close
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
