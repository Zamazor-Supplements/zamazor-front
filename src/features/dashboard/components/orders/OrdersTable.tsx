import {
	AlertCircleIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	EyeIcon,
	XIcon,
} from "lucide-react";
import { Tooltip } from "@/shared/components/ui/tooltip";
import type { Order, OrderPage } from "@/features/orders/schemas/orderSchema";
import type { OrderStatus } from "@/features/orders/constants/orderStatus";
import {
	isFinalOrderStatus,
	ORDER_STATUS_META,
} from "@/features/orders/constants/orderStatus";
import { formatCurrency } from "@/shared/utils/price";
import { buildShippingAddressString } from "@/features/addresses/utils/addressHelpers";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { OrderItemsPopover } from "./OrderItemPopover";

interface OrdersTableProps {
	orderPage: OrderPage;
	updatingStatusOrderId: string | null;
	isFetching: boolean;
	onViewOrder: (order: Order) => void;
	onChangeStatus: (orderId: string, status: OrderStatus) => void;
	onCancelOrder: (orderId: string) => void;
	onPageChange: (page: number) => void;
}

export const OrdersTable = ({
	orderPage,
	updatingStatusOrderId,
	isFetching,
	onViewOrder,
	onChangeStatus,
	onCancelOrder,
	onPageChange,
}: OrdersTableProps) => {
	const currentPage = orderPage.page;

	const canChangeStatus = (status: OrderStatus) => !isFinalOrderStatus(status);
	const nextPage = () =>
		onPageChange(Math.min(orderPage.totalPages, currentPage + 1));
	const previousPage = () => onPageChange(Math.max(0, currentPage - 1));

	return (
		<>
			{/* Background Refetch Progress Indicator */}
			{isFetching && (
				<div className="absolute top-0 left-0 right-0 h-1 bg-emerald-100 overflow-hidden z-20">
					<div className="h-full bg-emerald-600 animate-pulse w-full" />
				</div>
			)}

			{/* Table Area */}
			<div
				className={`min-h-96 overflow-x-auto transition-opacity duration-200 ${
					isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
				}`}
			>
				<table className="w-full min-w-240 border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
							<th className="px-6 py-3.5 w-28">Order ID</th>
							<th className="px-6 py-3.5">Items</th>
							<th className="px-6 py-3.5 w-32">Date</th>
							<th className="px-6 py-3.5 w-28">Total</th>
							<th className="px-6 py-3.5 w-56">Shipping</th>
							<th className="px-6 py-3.5 w-32">Status</th>
							<th className="px-6 py-3.5 text-right w-36">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{orderPage.items.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-6 py-16 text-center">
									<div className="mx-auto flex max-w-xs flex-col items-center gap-2">
										<div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
											<AlertCircleIcon className="size-6" />
										</div>
										<p className="text-sm font-medium text-slate-900">
											No orders found
										</p>
										<p className="text-xs text-slate-500">
											No orders matched your current search or status filter.
										</p>
									</div>
								</td>
							</tr>
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
										className="group transition-colors duration-150 hover:bg-slate-50/60"
									>
										{/* Order ID */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<Tooltip content={`Full ID: ${order.id}`}>
												<span className="shrink-0 cursor-help rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-600 select-all border border-slate-200/50">
													#{order.id.slice(0, 8).toUpperCase()}
												</span>
											</Tooltip>
										</td>

										{/* Items Overview */}
										<td className="px-6 py-3.5 max-w-50 truncate">
											<OrderItemsPopover items={order.items} />
										</td>

										{/* Date */}
										<td className="px-6 py-3.5 text-xs text-slate-500 whitespace-nowrap">
											{order.createdAt.toLocaleDateString(undefined, {
												dateStyle: "medium",
											})}
										</td>

										{/* Total */}
										<td className="px-6 py-3.5 text-xs font-bold text-slate-900 whitespace-nowrap">
											{formatCurrency(order.total)}
										</td>

										{/* Shipping Address (Fixed overflow) */}
										<td className="px-6 py-3.5 max-w-55 truncate whitespace-nowrap">
											<Tooltip content={shippingAddress}>
												<div className="space-y-0.5 overflow-hidden">
													<p className="truncate text-xs font-medium text-slate-700">
														{shippingAddress}
													</p>
													<p className="truncate text-[11px] text-slate-400">
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
														className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-95"
													>
														<EyeIcon className="size-4" />
													</button>
												</Tooltip>

												{canChangeStatus(order.status) && (
													<Tooltip content="Cancel Order">
														<button
															onClick={() => onCancelOrder(order.id)}
															className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
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

			{/* Pagination Footer */}
			{orderPage.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 border-t border-slate-200/80 bg-slate-50/50 p-4 select-none">
					<div className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white p-1">
						<button
							disabled={currentPage === 0 || isFetching}
							onClick={previousPage}
							className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
							title="Previous Page"
						>
							<ChevronLeftIcon className="size-4" />
						</button>

						{Array.from({ length: orderPage.totalPages }).map((_, index) => (
							<button
								key={index}
								disabled={isFetching}
								onClick={() => onPageChange(index)}
								className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
									currentPage === index
										? "bg-emerald-900 text-white shadow-xs"
										: "border border-slate-200 text-slate-700 hover:bg-slate-100"
								}`}
							>
								{index + 1}
							</button>
						))}

						<button
							disabled={currentPage >= orderPage.totalPages - 1 || isFetching}
							onClick={nextPage}
							className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
							title="Next Page"
						>
							<ChevronRightIcon className="size-4" />
						</button>
					</div>
				</div>
			)}
		</>
	);
};
