import { ORDER_STATUS_META } from "@/features/orders/constants/orderStatus";
import type { OrderStatus } from "@/features/orders/constants/orderStatus";
import { isFinalOrderStatus } from "@/features/orders/constants/orderStatus";

type OrderStatusSelectProps = {
	orderId: string;
	currentStatus: OrderStatus;
	isUpdating: boolean;
	onStatusChange: (orderId: string, status: OrderStatus) => void;
};

export const OrderStatusSelect = ({
	orderId,
	currentStatus,
	isUpdating,
	onStatusChange,
}: OrderStatusSelectProps) => {
	const canChangeStatus = !isFinalOrderStatus(currentStatus);

	return (
		<select
			value={currentStatus}
			disabled={isUpdating || !canChangeStatus}
			onChange={(e) => onStatusChange(orderId, e.target.value as OrderStatus)}
			className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600 outline-none transition-colors hover:border-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
			title="Change order status"
		>
			{Object.entries(ORDER_STATUS_META).map(([status, meta]) => (
				<option key={status} value={status}>
					{meta.label}
				</option>
			))}
		</select>
	);
};
