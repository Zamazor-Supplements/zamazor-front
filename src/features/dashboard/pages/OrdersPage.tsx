import { useCallback, useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { RotateCwIcon } from "lucide-react";
import type { Order } from "@/features/orders/schemas/orderSchema";
import {
	OrderStatus,
	type OrderStatusFilter,
} from "@/features/orders/constants/orderStatus";

import { OrderAnalyticsCards } from "../components/orders/OrderAnalyticsCards";
import { OrderFiltersToolbar } from "../components/orders/OrderFiltersToolbar";
import { OrdersTable } from "../components/orders/OrdersTable";
import { OrderDetailModal } from "../components/orders/OrderDetailModal";
import {
	useCancelOrder,
	useChangeOrderStatus,
} from "@/features/orders/services/mutations";
import { useOrders } from "@/features/orders/services/queries";
import {
	DASHBOARD_ORDER_PAGE_SIZE,
	useDashboardOrderFilters,
	type DashboardOrderSort,
} from "../hooks/use-dashboard-order-filters";
import { OrderPageSkeleton } from "../components/orders/OrdersPageSkeleton";
import { PageHeader } from "../components/shared/PageHeader";

type Filters = {
	search: string | undefined;
	status: OrderStatusFilter;
};

type Pagination = {
	page: number;
	size: number;
	sort: DashboardOrderSort;
};

type ConfirmState = {
	open: boolean;
	title: string;
	description: string;
	action: (() => Promise<void> | void) | null;
	destructive: boolean;
	confirmText: string;
};

const DEFAULT_CONFIRM: ConfirmState = {
	open: false,
	title: "",
	description: "",
	action: null,
	destructive: false,
	confirmText: "Continue",
};

export default function OrdersPage() {
	useDocumentTitle(`Orders Management | ${CONFIG.APP_NAME}`);

	// Grouped states
	const { filters, updateFilters, setPage, resetFilters, isFilterActive } =
		useDashboardOrderFilters();
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
		page: filters.page,
		size: DASHBOARD_ORDER_PAGE_SIZE,
		sort: filters.sort,
	});

	// Helper functions — filter and sort changes both snap back to page 0.
	const handleFilterChange = (next: Partial<Filters>) => {
		updateFilters({ ...next, page: 0 });
	};

	const handlePaginationChange = (next: Partial<Pagination>) => {
		updateFilters({ ...next, page: next.page ?? 0 });
	};

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

	const handleRefundOrder = (orderId: string) => {
		const order = orderPage?.items.find((o) => o.id === orderId);
		const orderLabel = order
			? `#${order.id.slice(0, 8).toUpperCase()}`
			: "this order";

		openConfirm({
			title: "Refund Order",
			description: `Are you sure you want to refund order ${orderLabel}? This action is permanent.`,
			action: () => {
				changeOrderStatusMutation.mutate(
					{ orderId, status: OrderStatus.Refunded },
					{
						onSuccess: (response) => {
							setSelectedOrder(response);
							closeConfirm();
						},
						onError: (error) => {
							console.error("Failed to refund order:", error);
						},
					},
				);
			},
			destructive: true,
			confirmText: "Refund Order",
		});
	};

	if (isPending) {
		return <OrderPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<PageHeader
				eyebrow="Orders"
				title="Order list"
				description="Filter, sort, and review checkout activity."
			>
				<Button
					variant="outline"
					onClick={() => refetch()}
					disabled={isFetching}
					className="h-10 rounded-lg border-brand-900/10 text-xs font-semibold text-ink transition-colors hover:bg-surface-2"
				>
					<RotateCwIcon
						className={`mr-1.5 size-3.5 ${isFetching ? "animate-spin text-brand-800" : ""}`}
					/>
					Refresh
				</Button>
			</PageHeader>

			{/* Analytics Cards */}
			{orderPage && <OrderAnalyticsCards orderPage={orderPage} />}

			{/* Table Container */}
			<div className="relative overflow-hidden rounded-lg border border-brand-900/10 bg-card shadow-xs">
				{/* Filters Toolbar */}
				<OrderFiltersToolbar
					filters={{
						search: filters.search,
						status: filters.status,
					}}
					pagination={{
						page: filters.page,
						sort: filters.sort,
						size: DASHBOARD_ORDER_PAGE_SIZE,
					}}
					totalElements={orderPage?.totalElements ?? 0}
					totalPages={orderPage?.totalPages ?? 0}
					isFilterActive={isFilterActive}
					updateFilters={handleFilterChange}
					updatePagination={handlePaginationChange}
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
						onRefundOrder={handleRefundOrder}
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
					onRefundOrder={handleRefundOrder}
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
}
