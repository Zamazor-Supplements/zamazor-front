import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/core/config/constants";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { Tooltip } from "@/shared/components/ui/tooltip";
import {
	isFinalOrderStatus,
	ORDER_STATUS_META,
	OrderStatus,
} from "@/features/orders/constants/orderStatus";
import { formatMadCompact } from "@/shared/utils/price";
import {
	AlertTriangle,
	BadgeDollarSign,
	CheckCircle2,
	Eye,
	Folder,
	Clock3,
	RefreshCw,
	Search,
	X,
} from "lucide-react";
import type { Order } from "@/features/orders/schemas/orderSchema";
import {
	useAllOrders,
	useCancelOrder,
	useChangeOrderStatus,
} from "@/features/orders/hooks/use-order";

const ORDERS_PER_PAGE = 8;

const CARD_MOTION = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.35 },
};

interface ConfirmModalState {
	isOpen: boolean;
	title: string;
	description: string;
	action: (() => void) | null;
	isDestructive: boolean;
	confirmText: string;
}

const INITIAL_CONFIRM_STATE: ConfirmModalState = {
	isOpen: false,
	title: "",
	description: "",
	action: null,
	isDestructive: false,
	confirmText: "Continue",
};

const formatMoney = (value: number) => formatMadCompact(value);

const formatShippingDetails = (order: Order | null) => {
	const street = (order?.shippingStreet || "").trim();
	const city = (order?.shippingCity || "").trim();
	const country = (order?.shippingCountry || "Morocco").trim();
	const phone = (order?.phone || "").trim();
	const phoneLabel = phone
		? `${country.toLowerCase() === "morocco" ? "🇲🇦 " : ""}${phone}`
		: "";

	return {
		street,
		city,
		country,
		phone,
		fullAddress: [street, city, country].filter(Boolean).join(", "),
		phoneLabel,
		tooltipLabel: [street, city, country, phone ? `Phone: ${phoneLabel}` : ""]
			.filter(Boolean)
			.join(", "),
	};
};

export const OrdersPage = () => {
	useDocumentTitle(`Orders Management | ${CONFIG.APP_NAME}`);

	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState<
		string | null
	>(null);

	const changeOrderStatusMutation = useChangeOrderStatus();
	const cancelOrderMutation = useCancelOrder();

	// Unified Dialog State
	const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(
		INITIAL_CONFIRM_STATE,
	);

	// Filter & Pagination States
	const [currentPage, setCurrentPage] = useState(0);
	const [orderSearch, setOrderSearch] = useState<string | undefined>(undefined);
	const [statusFilter, setStatusFilter] = useState<string | undefined>(
		undefined,
	);
	const [sortBy, setSortBy] = useState("createdAt,desc");

	const {
		data: orderPage,
		isPending,
		refetch,
	} = useAllOrders({
		page: currentPage,
		size: ORDERS_PER_PAGE,
		status: statusFilter,
		userFullName: orderSearch?.trim(),
		sort: sortBy,
	});

	const [confirmOpen, setConfirmOpen] = useState(false);

	const showConfirm = (
		title: string,
		description: string,
		action: () => void,
		isDestructive = false,
		confirmText = "Continue",
	) => {
		setConfirmModal({
			isOpen: true,
			title,
			description,
			action: () => action,
			isDestructive,
			confirmText,
		});
	};

	const closeConfirm = () => setConfirmModal(INITIAL_CONFIRM_STATE);

	const handleChangeOrderStatus = useCallback(
		(orderId: string, nextStatus: OrderStatus) => {
			const order = orderPage?.items.find((entry) => entry.id === orderId);
			if (!order || order.status === nextStatus) return;

			const currentStatus = ORDER_STATUS_META[order.status].label;
			const targetStatus = ORDER_STATUS_META[nextStatus].label;
			const isIrreversible = isFinalOrderStatus(nextStatus);

			showConfirm(
				isIrreversible ? "Confirm Final Status" : "Update Order Status",
				`Change order ${order.id.slice(0, 8).toUpperCase()} from ${currentStatus} to ${targetStatus}?${
					isIrreversible ? " This is a final status and cannot be undone." : ""
				}`,
				async () => {
					try {
						setUpdatingStatusOrderId(orderId);
						const response = await changeOrderStatusMutation.mutateAsync({
							orderId,
							status: nextStatus,
						});

						setSelectedOrder(response);
					} finally {
						setUpdatingStatusOrderId(null);
						closeConfirm();
					}
				},
				isIrreversible,
				isIrreversible ? "Confirm" : "Update Status",
			);
		},
		[changeOrderStatusMutation, orderPage?.items],
	);

	const handleCancelOrder = (orderId: string) => {
		const order = orderPage?.items.find((o) => o.id === orderId);
		const orderLabel = order
			? order.id.slice(0, 8).toUpperCase()
			: "this order";

		showConfirm(
			"Cancel Order",
			`Are you sure you want to cancel order ${orderLabel}? This action updates the status permanently.`,
			async () => {
				const response = await cancelOrderMutation.mutateAsync(orderId);

				setSelectedOrder(response);
				closeConfirm();
			},
			true,
			"Cancel Order",
		);
	};

	const isFilterActive =
		orderSearch || statusFilter || sortBy !== "createdAt,desc";

	const resetFilters = () => {
		setOrderSearch(undefined);
		setStatusFilter(undefined);
		setSortBy("createdAt,desc");
		setCurrentPage(0);
	};

	const { pendingOrders, paidOrders, totalSales } = useMemo(() => {
		const items = orderPage?.items || [];
		let pending = 0;
		let paid = 0;
		let revenue = 0;

		items.forEach((order) => {
			if (order.status === "PENDING") pending++;
			if (order.status === "PAID") paid++;
			if (["PAID", "COMPLETED", "DELIVERED"].includes(order.status)) {
				revenue += order.total || 0;
			}
		});

		return { pendingOrders: pending, paidOrders: paid, totalSales: revenue };
	}, [orderPage?.items]);

	const canChangeStatus = (status: OrderStatus) => !isFinalOrderStatus(status);

	const rangeLabel = useMemo(() => {
		if (!orderPage || orderPage.totalElements === 0) return "No orders found";
		const start = currentPage * ORDERS_PER_PAGE + 1;
		const end = Math.min(
			(currentPage + 1) * ORDERS_PER_PAGE,
			orderPage.totalElements,
		);
		return `Showing ${start}-${end} of ${orderPage.totalElements}`;
	}, [orderPage, currentPage]);

	if (isPending) {
		return (
			<div className="flex min-h-100 flex-col items-center justify-center gap-3">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-950" />
				<p className="text-xs font-semibold text-slate-500">
					Loading orders registry...
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800">
						Orders
					</p>
					<h2 className="text-2xl font-playfair text-slate-950 sm:text-3xl">
						Order list
					</h2>
					<p className="max-w-2xl text-sm text-slate-500">
						Filter, sort, and review checkout activity.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={() => refetch()}
						className="h-10 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold"
					>
						<RefreshCw className="mr-1.5 size-4" />
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					{
						label: "Total Orders",
						value: orderPage?.totalElements ?? 0,
						subtitle: "Across the registry",
						accent: "bg-slate-50 text-slate-700",
						icon: Folder,
					},
					{
						label: "Pending",
						value: pendingOrders,
						subtitle: "Waiting for action",
						accent: "bg-amber-50 text-amber-700",
						icon: Clock3,
					},
					{
						label: "Paid",
						value: paidOrders,
						subtitle: "Orders completed payment",
						accent: "bg-sky-50 text-sky-700",
						icon: CheckCircle2,
					},
					{
						label: "Revenue",
						value: formatMoney(totalSales),
						subtitle: "From settled orders",
						accent: "bg-lime-50 text-lime-700",
						icon: BadgeDollarSign,
					},
				].map((metric, index) => {
					const Icon = metric.icon;

					return (
						<motion.div
							key={metric.label}
							{...CARD_MOTION}
							transition={{ duration: 0.35, delay: index * 0.05 }}
							className="relative overflow-hidden rounded-3xl border border-white bg-white p-5 shadow-[0_16px_36px_-28px_rgba(15,23,42,0.42)] ring-1 ring-slate-100 transition-shadow hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)]"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
										{metric.label}
									</p>
									<h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
										{metric.value}
									</h3>
									<p className="mt-1 text-xs text-slate-500">
										{metric.subtitle}
									</p>
								</div>
								<div
									className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset ring-slate-200/70 ${metric.accent}`}
								>
									<Icon className="size-5" />
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<div className="rounded-3xl border border-emerald-900/5 bg-white shadow-md overflow-hidden">
				<div className="border-b border-slate-100 bg-white p-4">
					<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
						<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center flex-1 max-w-3xl">
							<div className="relative flex-1 min-w-0">
								<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
								<Input
									value={orderSearch}
									onChange={(e) => {
										setOrderSearch(e.target.value);
									}}
									placeholder="Search order ID, address, item, or status..."
									className="h-10 rounded-xl border-slate-200 bg-slate-50/40 pl-9 text-xs focus-visible:ring-emerald-800"
								/>
							</div>

							{isFilterActive && (
								<Button
									variant="outline"
									onClick={resetFilters}
									className="h-10 shrink-0 rounded-xl border border-dashed border-red-200 bg-red-50/25 px-3 text-xs font-semibold text-red-600 transition-all duration-150 hover:bg-red-50 hover:text-red-700"
								>
									Reset
									<X className="ml-1.5 size-3.5" />
								</Button>
							)}

							<select
								value={statusFilter}
								onChange={(e) => {
									setStatusFilter(e.target.value);
								}}
								className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
							>
								<option value="all">All Statuses</option>
								{Object.entries(ORDER_STATUS_META).map(([status, meta]) => (
									<option key={status} value={status}>
										{meta.label}
									</option>
								))}
							</select>

							<select
								value={sortBy}
								onChange={(e) => {
									setSortBy(e.target.value);
								}}
								className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
							>
								<option value="createdAt,desc">Newest first</option>
								<option value="createdAt,asc">Oldest first</option>
								<option value="total,desc">Highest total</option>
								<option value="total,asc">Lowest total</option>
								<option value="status,asc">Status</option>
							</select>
						</div>

						<div className="flex items-center gap-2">
							<div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs font-bold text-slate-500">
								{rangeLabel}
							</div>
							{(orderPage?.totalPages ?? 0) > 1 && (
								<div className="flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50/50 p-0.5 select-none">
									<Button
										variant="outline"
										size="icon"
										disabled={currentPage === 0}
										onClick={() => {}}
										className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
										title="Previous page"
									>
										&larr;
									</Button>
									<span className="min-w-13.75 px-1.5 text-center text-[10px] font-bold text-slate-500">
										{currentPage + 1} / {orderPage?.totalPages}
									</span>
									<Button
										variant="outline"
										size="icon"
										disabled={currentPage >= (orderPage?.totalPages ?? 1) - 1}
										onClick={() => setCurrentPage((prev) => prev + 1)}
										className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
										title="Next page"
									>
										&rarr;
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
								<th className="px-6 py-4">Order ID</th>
								<th className="px-6 py-4">Items</th>
								<th className="px-6 py-4">Date</th>
								<th className="px-6 py-4">Total</th>
								<th className="px-6 py-4">Shipping</th>
								<th className="px-6 py-4">Status</th>
								<th className="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{!orderPage || orderPage.items.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="px-6 py-14 text-center text-slate-400"
									>
										<div className="flex flex-col items-center gap-2">
											<div className="grid size-12 place-items-center rounded-2xl bg-slate-50 text-slate-300">
												<AlertTriangle className="size-5" />
											</div>
											<div>
												<p className="text-sm font-semibold text-slate-600">
													No orders match the current filters.
												</p>
												<p className="mt-1 text-xs text-slate-400">
													Try a different search term or reset the filters.
												</p>
											</div>
										</div>
									</td>
								</tr>
							) : (
								orderPage?.items.map((order) => {
									const shipping = formatShippingDetails(order);
									const meta = ORDER_STATUS_META[order.status];
									return (
										<tr key={order.id} className="hover:bg-slate-50/40">
											<td className="px-6 py-4">
												<Tooltip content={order.id}>
													<span className="cursor-help select-all font-mono text-[10px] font-bold text-slate-500">
														{order.id.slice(0, 8).toUpperCase()}
													</span>
												</Tooltip>
											</td>
											<td className="px-6 py-4">
												<div className="flex flex-col gap-0.5">
													{order.items.slice(0, 2).map((item) => (
														<span
															key={item.id}
															className="max-w-50 truncate text-xs font-semibold text-slate-700"
														>
															{item.product?.name || "Unknown"}{" "}
															<span className="text-slate-400">
																x{item.quantity}
															</span>
														</span>
													))}
													{order.items.length > 2 && (
														<span className="text-[10px] font-semibold text-slate-400">
															+{order.items.length - 2} more
														</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 text-xs text-slate-500">
												{order.createdAt.toLocaleDateString(undefined, {
													dateStyle: "medium",
												})}
											</td>
											<td className="px-6 py-4 text-xs font-semibold text-slate-950">
												{formatMoney(order.total)}
											</td>
											<td className="px-6 py-4">
												<Tooltip
													content={shipping.tooltipLabel || "No address"}
												>
													<div className="max-w-60 space-y-0.5">
														{shipping.fullAddress ? (
															<>
																<p className="truncate text-xs font-semibold text-slate-700">
																	{shipping.fullAddress}
																</p>
																{shipping.phoneLabel ? (
																	<p className="truncate text-xs text-slate-500">
																		Phone: {shipping.phoneLabel}
																	</p>
																) : null}
															</>
														) : (
															<p className="text-xs text-slate-400">
																No shipping address
															</p>
														)}
													</div>
												</Tooltip>
											</td>
											<td className="px-6 py-4">
												<span
													className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.badgeClass}`}
												>
													{meta.label}
												</span>
											</td>
											<td className="px-6 py-4 text-right">
												<div className="flex items-center justify-end gap-2">
													<Tooltip content="View Details">
														<button
															onClick={() => setSelectedOrder(order)}
															className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-950"
														>
															<Eye className="size-4" />
														</button>
													</Tooltip>
													{canChangeStatus(order.status) && (
														<Tooltip content="Cancel Order">
															<button
																onClick={() => handleCancelOrder(order.id)}
																className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
															>
																<X className="size-4" />
															</button>
														</Tooltip>
													)}
													<select
														value={order.status}
														disabled={
															updatingStatusOrderId === order.id ||
															!canChangeStatus(order.status)
														}
														onChange={(e) =>
															handleChangeOrderStatus(
																order.id,
																e.target.value as OrderStatus,
															)
														}
														className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600 outline-none transition-colors hover:border-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
														title="Change order status"
													>
														{Object.entries(ORDER_STATUS_META).map(
															([status, meta]) => (
																<option key={status} value={status}>
																	{meta.label}
																</option>
															),
														)}
													</select>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{(orderPage?.totalPages ?? 0) > 1 && (
					<div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-white p-4 select-none">
						<div className="flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50/50 p-0.5">
							<Button
								variant="outline"
								size="icon"
								disabled={orderPage?.page === 1}
								onClick={() => {}}
								className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
								title="Previous Page"
							>
								&larr;
							</Button>

							{Array.from({ length: orderPage?.totalPages ?? 0 }).map(
								(_, index) => (
									<Button
										key={index}
										variant={currentPage === index ? "default" : "outline"}
										onClick={() => setCurrentPage(index)}
										className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
											currentPage === index
												? "border-emerald-900 bg-emerald-900 text-white hover:bg-emerald-950"
												: "border-emerald-900/10 text-emerald-800 hover:bg-emerald-50"
										}`}
									>
										{index + 1}
									</Button>
								),
							)}

							<Button
								variant="outline"
								size="icon"
								disabled={currentPage >= (orderPage?.totalPages ?? 1) - 1}
								onClick={() => setCurrentPage((prev) => prev + 1)}
								className="h-7 w-7 rounded-md border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 disabled:opacity-40"
								title="Next Page"
							>
								&rarr;
							</Button>
						</div>
					</div>
				)}
			</div>

			{selectedOrder && (
				<div className="fixed inset-0 z-999 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
					<div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
						<button
							onClick={() => setSelectedOrder(null)}
							className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
						>
							<X className="size-4" />
						</button>

						<div className="mb-6 flex flex-wrap items-baseline gap-3">
							<h3 className="font-sans text-xl font-semibold text-slate-950">
								Order{" "}
								<span className="font-mono text-base">
									{selectedOrder.id.slice(0, 8).toUpperCase()}
								</span>
							</h3>
							<span
								className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ORDER_STATUS_META[selectedOrder.status].badgeClass}`}
							>
								{ORDER_STATUS_META[selectedOrder.status].label}
							</span>
						</div>

						<div className="mb-6 grid gap-6 border-b border-slate-100 pb-5 text-sm sm:grid-cols-2">
							<div>
								<span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
									Shipping Details
								</span>
								<div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
									{formatShippingDetails(selectedOrder).fullAddress ? (
										<>
											<div className="space-y-1.5">
												<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
													Street
												</p>
												<p className="font-semibold text-slate-950">
													{formatShippingDetails(selectedOrder).street || "-"}
												</p>
											</div>
											<div className="space-y-1.5">
												<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
													City
												</p>
												<p className="font-semibold text-slate-950">
													{formatShippingDetails(selectedOrder).city || "-"}
												</p>
											</div>
											<div className="space-y-1.5">
												<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
													Country
												</p>
												<p className="font-semibold text-slate-950">
													{formatShippingDetails(selectedOrder).country || "-"}
												</p>
											</div>
											<div className="space-y-1.5">
												<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
													Phone
												</p>
												<p className="font-semibold text-slate-950">
													{formatShippingDetails(selectedOrder).phoneLabel ||
														"-"}
												</p>
											</div>
											<div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
												<p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
													Full Address
												</p>
												<p className="mt-1 font-semibold text-slate-950">
													{formatShippingDetails(selectedOrder).fullAddress}
												</p>
											</div>
										</>
									) : (
										<p className="text-sm font-medium text-slate-500">
											No shipping address provided.
										</p>
									)}
								</div>
							</div>
							<div>
								<span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
									Order Date & Metadata
								</span>
								<p className="text-slate-800">
									Date:{" "}
									<strong className="font-sans text-slate-950">
										{selectedOrder.createdAt.toLocaleString(undefined, {
											dateStyle: "long",
											timeStyle: "short",
										})}
									</strong>
								</p>
								<p className="mt-1 text-slate-800">
									Total Amount:{" "}
									<strong className="font-sans text-slate-950">
										{formatMoney(selectedOrder.total || 0)}
									</strong>
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
								Ordered Items
							</span>
							<div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/30">
								{selectedOrder.items.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-4 text-sm"
									>
										<div className="flex items-center gap-2">
											<Folder className="size-4 text-emerald-800/60" />
											<span className="font-bold text-slate-900">
												{item.product?.name || "Unknown Product"}
											</span>
											<span className="text-xs font-bold text-slate-400">
												x{item.quantity}
											</span>
										</div>
										<span className="font-semibold text-slate-950">
											{formatMoney(item.product.price * item.quantity)}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
							<select
								value={selectedOrder.status}
								disabled={
									updatingStatusOrderId === selectedOrder.id ||
									!canChangeStatus(selectedOrder.status)
								}
								onChange={(e) =>
									handleChangeOrderStatus(
										selectedOrder.id,
										e.target.value as OrderStatus,
									)
								}
								className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-600 outline-none transition-colors hover:border-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
								title="Change order status"
							>
								{Object.entries(ORDER_STATUS_META).map(([status, meta]) => (
									<option key={status} value={status}>
										{meta.label}
									</option>
								))}
							</select>
							{canChangeStatus(selectedOrder.status) && (
								<Button
									variant="outline"
									onClick={() => handleCancelOrder(selectedOrder.id)}
									className="h-10 rounded-xl border-rose-200 px-5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
								>
									<AlertTriangle className="mr-1.5 size-4" />
									Cancel Order
								</Button>
							)}
							<Button
								onClick={() => setSelectedOrder(null)}
								className="h-10 rounded-xl bg-slate-900 px-5 text-xs font-bold text-white hover:bg-slate-950"
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			)}

			<ConfirmDialog
				isOpen={confirmOpen}
				title={confirmModal.title}
				description={confirmModal.description}
				confirmText={confirmModal.confirmText}
				isDestructive={confirmModal.isDestructive}
				onConfirm={() => confirmModal.action?.()}
				onClose={() => setConfirmOpen(false)}
			/>
		</div>
	);
};
