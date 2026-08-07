import { XIcon, FolderIcon, AlertTriangleIcon } from "lucide-react";
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

type OrderDetailModalProps = {
	order: Order;
	updatingStatusOrderId: string | null;
	onClose: () => void;
	onChangeStatus: (orderId: string, status: OrderStatus) => void;
	onCancelOrder: (orderId: string) => void;
};

export const OrderDetailModal = ({
	order,
	updatingStatusOrderId,
	onClose,
	onChangeStatus,
	onCancelOrder,
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
		<div className="fixed inset-0 z-999 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs animate-in fade-in duration-200">
			<div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
				>
					<XIcon className="size-4" />
				</button>

				{/* Header */}
				<div className="mb-6 flex flex-wrap items-baseline gap-3 p-6 pb-0">
					<h3 className="font-sans text-xl font-semibold text-slate-950">
						Order{" "}
						<span className="font-mono text-base">
							{order.id.slice(0, 8).toUpperCase()}
						</span>
					</h3>
					<span
						className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.badgeClass}`}
					>
						{meta.label}
					</span>
				</div>

				{/* Shipping & Order Details */}
				<div className="mb-6 grid gap-6 border-b border-slate-100 pb-6 px-6 text-sm sm:grid-cols-2">
					<div>
						<span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
							Shipping Details
						</span>
						<div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
							<div className="space-y-1.5">
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									Street
								</p>
								<p className="font-semibold text-slate-950">
									{order.shippingStreet}
								</p>
							</div>
							<div className="space-y-1.5">
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									City
								</p>
								<p className="font-semibold text-slate-950">
									{order.shippingCity}
								</p>
							</div>
							<div className="space-y-1.5">
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									Country
								</p>
								<p className="font-semibold text-slate-950">
									{order.shippingCountry}
								</p>
							</div>
							<div className="space-y-1.5">
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									Phone
								</p>
								<p className="font-semibold text-slate-950">{order.phone}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									Full Address
								</p>
								<p className="mt-1 font-semibold text-slate-950">
									{shippingAddress}
								</p>
							</div>
						</div>
					</div>

					<div>
						<span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-400">
							Order Date & Metadata
						</span>
						<div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
							<div>
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									Created At
								</p>
								<p className="mt-1 font-semibold text-slate-950">
									{order.createdAt.toLocaleString(undefined, {
										dateStyle: "long",
										timeStyle: "short",
									})}
								</p>
							</div>
							<div>
								<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
									Total Amount
								</p>
								<p className="mt-1 font-semibold text-slate-950">
									{formatCurrency(order.total ?? 0)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Order Items */}
				<div className="mb-6 space-y-3 px-6">
					<span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
						Ordered Items
					</span>
					<div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/30">
						{order.items.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between border-b border-slate-100 p-4 text-sm last:border-b-0"
							>
								<div className="flex items-center gap-2">
									<FolderIcon className="size-4 text-emerald-800/60" />
									<span className="font-bold text-slate-900">
										{item.product?.name || "Unknown Product"}
									</span>
									<span className="text-xs font-bold text-slate-400">
										x{item.quantity}
									</span>
								</div>
								<span className="font-semibold text-slate-950">
									{formatCurrency(item.product.price * item.quantity)}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col gap-3 border-t border-slate-100 p-6 pt-6 sm:flex-row sm:justify-end">
					<OrderStatusSelect
						orderId={order.id}
						currentStatus={order.status}
						isUpdating={updatingStatusOrderId === order.id}
						onStatusChange={onChangeStatus}
					/>

					{canChangeStatus && (
						<Button
							variant="outline"
							onClick={() => onCancelOrder(order.id)}
							className="h-10 rounded-xl border-rose-200 px-5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
						>
							<AlertTriangleIcon className="mr-1.5 size-4" />
							Cancel Order
						</Button>
					)}

					<Button
						onClick={onClose}
						className="h-10 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white hover:bg-slate-950"
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	);
};
