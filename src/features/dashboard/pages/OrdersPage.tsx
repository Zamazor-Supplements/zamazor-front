import { useCallback, useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { RefreshCwIcon } from "lucide-react";
import type { Order } from "@/features/orders/schemas/orderSchema";
import type { OrderStatus } from "@/features/orders/constants/orderStatus";

import { OrderAnalyticsCards } from "../components/orders/OrderAnalyticsCards";
import { OrderFiltersToolbar } from "../components/orders/OrderFiltersToolbar";
import { OrdersTable } from "../components/orders/OrdersTable";
import { OrderDetailModal } from "../components/orders/OrderDetailModal";
import {
	useCancelOrder,
	useChangeOrderStatus,
} from "@/features/orders/services/mutations";
import { useOrders } from "@/features/orders/services/queries";
import { OrderPageSkeleton } from "../components/orders/OrdersPageSkeleton";

const ORDERS_PER_PAGE = 6;

type Filters = {
	search: string | undefined;
	status: OrderStatus | undefined;
};

type Sort =
	| "createdAt,desc"
	| "createdAt,asc"
	| "total,desc"
	| "total,asc"
	| "status,asc";
type Pagination = {
	page: number;
	size: number;
	sort: Sort;
};

type ConfirmState = {
	open: boolean;
	title: string;
	description: string;
	action: (() => Promise<void> | void) | null;
	destructive: boolean;
	confirmText: string;
};

const DEFAULT_FILTERS: Filters = {
	search: undefined,
	status: undefined,
};

const DEFAULT_PAGINATION: Pagination = {
	page: 0,
	size: ORDERS_PER_PAGE,
	sort: "createdAt,desc",
};

const DEFAULT_CONFIRM: ConfirmState = {
	open: false,
	title: "",
	description: "",
	action: null,
	destructive: false,
	confirmText: "Continue",
};

export const OrdersPage = () => {
	useDocumentTitle(`Orders Management | ${CONFIG.APP_NAME}`);

	// Grouped states
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
	const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState<
		string | null
	>(null);
	const [confirm, setConfirm] = useState<ConfirmState>(DEFAULT_CONFIRM);

	// Mutations
	const changeOrderStatusMutation = useChangeOrderStatus();
	const cancelOrderMutation = useCancelOrder();

	// Query
	const {
		data: orderPage,
		isPending,
		isFetching,
		refetch,
	} = useOrders({
		status: filters.status,
		userFullName: filters.search?.trim(),
		page: pagination.page,
		size: pagination.size,
		sort: pagination.sort,
	});

	// Helper functions
	const updateFilters = (next: Partial<Filters>) => {
		setFilters((prev) => ({ ...prev, ...next }));
		setPagination((prev) => ({ ...prev, page: 0 }));
	};

	const updatePagination = (next: Partial<Pagination>) => {
		setPagination((prev) => ({ ...prev, page: 0, ...next }));
	};

	const setPage = (page: number) => {
		setPagination((prev) => ({ ...prev, page }));
	};

	const resetFilters = () => {
		setFilters(DEFAULT_FILTERS);
		setPagination(DEFAULT_PAGINATION);
	};

	const isFilterActive =
		!!filters.search ||
		!!filters.status ||
		pagination.sort !== DEFAULT_PAGINATION.sort;

	const openConfirm = ({
		title,
		description,
		action,
		destructive = false,
		confirmText = "Continue",
	}: Omit<ConfirmState, "open">) => {
		setConfirm({
			open: true,
			title,
			description,
			action,
			destructive,
			confirmText,
		});
	};

	const closeConfirm = () => {
		setConfirm(DEFAULT_CONFIRM);
	};

	const handleChangeOrderStatus = useCallback(
		(orderId: string, nextStatus: OrderStatus) => {
			const order = orderPage?.items.find((entry) => entry.id === orderId);
			if (!order || order.status === nextStatus) return;

			openConfirm({
				title: "Update Order Status",
				description: `Change order #${order.id.slice(0, 8).toUpperCase()} status to ${nextStatus}?`,
				action: async () => {
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
				destructive: false,
				confirmText: "Update Status",
			});
		},
		[changeOrderStatusMutation, orderPage?.items],
	);

	const handleCancelOrder = (orderId: string) => {
		const order = orderPage?.items.find((o) => o.id === orderId);
		const orderLabel = order
			? `#${order.id.slice(0, 8).toUpperCase()}`
			: "this order";

		openConfirm({
			title: "Cancel Order",
			description: `Are you sure you want to cancel order ${orderLabel}? This action is permanent.`,
			action: async () => {
				const response = await cancelOrderMutation.mutateAsync(orderId);
				setSelectedOrder(response);
				closeConfirm();
			},
			destructive: true,
			confirmText: "Cancel Order",
		});
	};

	if (isPending) {
		return <OrderPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div className="space-y-1">
					<p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800">
						Orders
					</p>
					<h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
						Order list
					</h2>
					<p className="max-w-2xl text-xs sm:text-sm text-slate-500">
						Filter, sort, and review checkout activity.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="outline"
						onClick={() => refetch()}
						disabled={isFetching}
						className="h-10 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						<RefreshCwIcon
							className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin text-emerald-800" : ""}`}
						/>
						Refresh
					</Button>
				</div>
			</div>

			{/* Analytics Cards */}
			{orderPage && <OrderAnalyticsCards orderPage={orderPage} />}

			{/* Table Container */}
			<div className="relative rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
				{/* Filters Toolbar */}
				<OrderFiltersToolbar
					filters={filters}
					pagination={pagination}
					totalElements={orderPage?.totalElements ?? 0}
					totalPages={orderPage?.totalPages ?? 0}
					isFilterActive={isFilterActive}
					updateFilters={updateFilters}
					updatePagination={updatePagination}
					onResetFilters={resetFilters}
				/>

				{/* Table Component */}
				{orderPage && (
					<OrdersTable
						orderPage={orderPage}
						isFetching={isFetching}
						updatingStatusOrderId={updatingStatusOrderId}
						onViewOrder={setSelectedOrder}
						onChangeStatus={handleChangeOrderStatus}
						onCancelOrder={handleCancelOrder}
						onPageChange={setPage}
					/>
				)}
			</div>

			{/* Detail Modal */}
			{selectedOrder && (
				<OrderDetailModal
					order={selectedOrder}
					updatingStatusOrderId={updatingStatusOrderId}
					onClose={() => setSelectedOrder(null)}
					onChangeStatus={handleChangeOrderStatus}
					onCancelOrder={handleCancelOrder}
				/>
			)}

			{/* Confirm Dialog */}
			<ConfirmDialog
				isOpen={confirm.open}
				title={confirm.title}
				description={confirm.description}
				confirmText={confirm.confirmText}
				isDestructive={confirm.destructive}
				isLoading={
					changeOrderStatusMutation.isPending || cancelOrderMutation.isPending
				}
				onConfirm={async () => {
					if (confirm.action) await confirm.action();
				}}
				onClose={closeConfirm}
			/>
		</div>
	);
};
