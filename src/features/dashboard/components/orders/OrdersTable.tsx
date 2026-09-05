import { AlertCircleIcon, EyeIcon, XIcon } from "lucide-react";
import { Tooltip } from "@/shared/components/ui/tooltip";
import type { Order, OrderPage } from "@/features/orders/schemas/orderSchema";
import type { OrderStatus } from "@/features/orders/constants/orderStatus";
import {
	isFinalOrderStatus,
	ORDER_STATUS_META,
} from "@/features/orders/constants/orderStatus";
import { formatCurrency } from "@/shared/utils/price";
import { buildShippingAddressString } from "@/features/addresses/utils/addressHelpers";
import { TableEmptyRow } from "../shared/TableEmptyRow";
import { TableFetchBar } from "../shared/TableFetchBar";
import { TablePagination } from "../shared/TablePagination";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { OrderItemsPopover } from "./OrderItemPopover";

interface OrdersTableProps {
	orderPage: OrderPage;
	updatingStatusOrderId: string | null;
	isFetching: boolean;
	onViewOrder: (order: Order) => void;
	onChangeStatus: (orderId: string, status: OrderStatus) => void;
	onRefundOrder: (orderId: string) => void;
	onPageChange: (page: number) => void;
}

export const OrdersTable = ({
	orderPage,
	updatingStatusOrderId,
	isFetching,
	onViewOrder,
	onChangeStatus,
	onRefundOrder,
	onPageChange,
}: OrdersTableProps) => {
	const canChangeStatus = (status: OrderStatus) => !isFinalOrderStatus(status);

	return (
		<>
			<TableFetchBar isFetching={isFetching} />

			{/* Table Area */}
			<div
				className={`min-h-96 overflow-x-auto transition-opacity duration-200 ${
					isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
				}`}
			>
				<table className="w-full min-w-240 border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-brand-900/10 bg-surface-2/80 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
							<th className="px-6 py-3.5 w-28">Order ID</th>
							<th className="px-6 py-3.5">Items</th>
							<th className="px-6 py-3.5 w-32">Date</th>
							<th className="px-6 py-3.5 w-28">Total</th>
							<th className="px-6 py-3.5 w-56">Shipping</th>
							<th className="px-6 py-3.5 w-32">Status</th>
							<th className="px-6 py-3.5 text-right w-36">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-brand-900/10">
						{orderPage.items.length === 0 ? (
							<TableEmptyRow
								colSpan={7}
								icon={AlertCircleIcon}
								title="No orders found"
								description="No orders matched your current search or status filter."
							/>
						) : (
							orderPage.items.map((order) => {
								const meta = ORDER_STATUS_META[order.status];
								const shippingAddress = buildShippingAddressString({
									city: order.shippingCity,
									country: order.shippingCountry,
									phone: order.phone,
									street: order.shippingStreet,
								});

								return (
									<tr
										key={order.id}
										className="group transition-colors duration-150 hover:bg-surface-2/60"
									>
										{/* Order ID */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<Tooltip content={`Full ID: ${order.id}`}>
												<span className="shrink-0 cursor-help select-all rounded border border-brand-900/10 bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-ink">
													#{order.id.slice(0, 8).toUpperCase()}
												</span>
											</Tooltip>
										</td>

										{/* Items Overview */}
										<td className="px-6 py-3.5 max-w-50 truncate">
											<OrderItemsPopover items={order.items} />
										</td>

										{/* Date */}
										<td className="px-6 py-3.5 text-xs text-ink-soft whitespace-nowrap">
											{order.createdAt.toLocaleDateString(undefined, {
												dateStyle: "medium",
											})}
										</td>

										{/* Total */}
										<td className="px-6 py-3.5 text-xs font-bold text-ink whitespace-nowrap">
											{formatCurrency(order.total)}
										</td>

										{/* Shipping Address (Fixed overflow) */}
										<td className="px-6 py-3.5 max-w-55 truncate whitespace-nowrap">
											<Tooltip content={shippingAddress}>
												<div className="space-y-0.5 overflow-hidden">
													<p className="truncate text-xs font-medium text-ink">
														{shippingAddress}
													</p>
													<p className="truncate text-[11px] text-ink-faint">
														Ph: {order.phone}
													</p>
												</div>
											</Tooltip>
										</td>

										{/* Status Badge */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
											>
												{meta.label}
											</span>
										</td>

										{/* Actions */}
										<td className="px-6 py-3.5 text-right whitespace-nowrap">
											<div className="flex items-center justify-end gap-1">
												<Tooltip content="View Order Details">
													<button
														onClick={() => onViewOrder(order)}
														className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink active:scale-95"
													>
														<EyeIcon className="size-4" />
													</button>
												</Tooltip>

												{canChangeStatus(order.status) && (
													<Tooltip content="Refund Order">
														<button
															onClick={() => onRefundOrder(order.id)}
															className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
														>
															<XIcon className="size-4" />
														</button>
													</Tooltip>
												)}

												<OrderStatusSelect
													orderId={order.id}
													currentStatus={order.status}
													isUpdating={updatingStatusOrderId === order.id}
													onStatusChange={onChangeStatus}
												/>
											</div>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			<TablePagination
				page={orderPage.page}
				size={orderPage.size}
				totalPages={orderPage.totalPages}
				totalElements={orderPage.totalElements}
				itemLabel="orders"
				disabled={isFetching}
				onPageChange={onPageChange}
			/>
		</>
	);
};
