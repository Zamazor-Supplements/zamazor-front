import { useCallback, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { RotateCwIcon } from "lucide-react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { ErrorFallback } from "@/shared/components/ui/error-fallback";
import type { Order } from "@/features/orders/schemas/orderSchema";
import { OrderStatus } from "@/features/orders/constants/orderStatus";
import {
	useCancelOrder,
	useChangeOrderStatus,
} from "@/features/orders/services/mutations";
import { useOrders } from "@/features/orders/services/queries";

import { OrderDetailModal } from "../components/orders/OrderDetailModal";
import {
	OrderFiltersToolbar,
	type OrderFilters,
} from "../components/orders/OrderFiltersToolbar";
import { OrdersTable } from "../components/orders/OrdersTable";
import { OrderPageSkeleton } from "../components/orders/OrdersPageSkeleton";
import { AnalyticsCards } from "../components/shared/AnalyticsCards";
import { PageHeader } from "../components/shared/PageHeader";
import { ORDER_METRICS_CONFIG } from "../config/metrics";
import {
	DASHBOARD_ORDER_PAGE_SIZE,
	useDashboardOrderFilters,
	type OrderSort,
} from "../hooks/use-dashboard-order-filters";
import { useDashboardOverview } from "../services/queries";

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

	const { filters, updateFilters, setPage, resetFilters, isFilterActive } =
		useDashboardOrderFilters();
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState<
		string | null
	>(null);
	const [confirm, setConfirm] = useState<ConfirmState>(DEFAULT_CONFIRM);

	const changeOrderStatusMutation = useChangeOrderStatus();
	const cancelOrderMutation = useCancelOrder();

	const {
		data: overview,
		isPending: isOverviewPending,
		isFetching: isOverviewFetching,
		refetch: refetchOverview,
	} = useDashboardOverview();

	const {
		data: orderPage,
		isPending: isOrdersPending,
		isFetching: isOrdersFetching,
		refetch: refetchOrders,
	} = useOrders(
		{
			status: filters.status,
			userFullName: filters.search?.trim() || undefined,
			page: filters.page,
			size: DASHBOARD_ORDER_PAGE_SIZE,
			sort: filters.sort,
		},
		{ placeholderData: keepPreviousData },
	);

	const isRefreshing = isOrdersFetching || isOverviewFetching;

	const handleRefresh = () => {
		refetchOrders();
		refetchOverview();
	};

	const handleFiltersChange = (next: Partial<OrderFilters>) => {
		updateFilters({ ...next, page: 0 });
	};

	const handleSortChange = (sort: OrderSort) => {
		updateFilters({ sort, page: 0 });
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

	if (isOrdersPending || isOverviewPending) {
		return <OrderPageSkeleton />;
	}

	if (!orderPage) {
		return (
			<ErrorFallback
				title="Couldn't load orders"
				description="The orders service did not return a valid response. Please try again."
				onRetry={() => refetchOrders()}
				className="min-h-96"
			/>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				eyebrow="Orders"
				title="Order list"
				description="Filter, sort, and review checkout activity."
			>
				<Button
					variant="outline"
					onClick={handleRefresh}
					disabled={isRefreshing}
					className="h-10 rounded-lg border-brand-900/10 text-xs font-semibold text-ink transition-colors hover:bg-surface-2"
				>
					<RotateCwIcon
						className={`mr-1.5 size-3.5 ${isRefreshing ? "animate-spin text-brand-800" : ""}`}
					/>
					Refresh
				</Button>
			</PageHeader>

			{overview && <AnalyticsCards metrics={ORDER_METRICS_CONFIG(overview)} />}

			<div className="relative overflow-hidden rounded-lg border border-brand-900/10 bg-card shadow-xs">
				<OrderFiltersToolbar
					filters={{ search: filters.search, status: filters.status }}
					sort={filters.sort}
					totalElements={orderPage.totalElements}
					isFilterActive={isFilterActive}
					onFiltersChange={handleFiltersChange}
					onSortChange={handleSortChange}
					onResetFilters={resetFilters}
				/>

				<OrdersTable
					orderPage={orderPage}
					isFetching={isOrdersFetching}
					updatingStatusOrderId={updatingStatusOrderId}
					onViewOrder={setSelectedOrder}
					onChangeStatus={handleChangeOrderStatus}
					onRefundOrder={handleRefundOrder}
					onPageChange={setPage}
				/>
			</div>

			{selectedOrder && (
				<OrderDetailModal
					order={selectedOrder}
					updatingStatusOrderId={updatingStatusOrderId}
					onClose={() => setSelectedOrder(null)}
					onChangeStatus={handleChangeOrderStatus}
					onRefundOrder={handleRefundOrder}
				/>
			)}

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
