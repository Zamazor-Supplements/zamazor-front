import { useState, useCallback } from "react";
import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { useAuthenticatedUser } from "@/features/auth/services/queries";
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { useCancelOrder } from "@/features/orders/services/mutations";
import type { Order } from "@/features/orders/schemas/orderSchema";
import { ProfileOrdersSection } from "../components/ProfileOrdersSection";

export default function UserOrdersPage() {
	useDocumentTitle(`My Orders | ${CONFIG.APP_NAME}`);

	// We still check auth but we don't strictly need user data here unless it's used directly
	useAuthenticatedUser();

	const cancelOrderMutation = useCancelOrder();
	const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

	const isCancelingOrder = cancelOrderMutation.isPending;

	const closeCancelDialog = useCallback(() => {
		if (!isCancelingOrder) {
			setOrderToCancel(null);
		}
	}, [isCancelingOrder]);

	const handleCancelOrder = useCallback(() => {
		if (!orderToCancel || orderToCancel.status !== "PENDING") {
			closeCancelDialog();
			return;
		}

		cancelOrderMutation.mutate(orderToCancel.id, {
			onSuccess: closeCancelDialog,
		});
	}, [orderToCancel, cancelOrderMutation, closeCancelDialog]);

	return (
		<div className="min-h-screen bg-surface py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-8">
				<Breadcrumbs
					items={[
						{ label: "Home", href: APP_ROUTES.HOME },
						{ label: "Profile", href: APP_ROUTES.USER.PROFILE },
						{ label: "Orders" },
					]}
				/>

				<div className="flex flex-col mb-8">
					<h1 className="text-3xl font-playfair font-bold text-ink mb-2">
						My Orders
					</h1>
					<p className="text-sm text-ink-soft">
						View and manage your recent purchases
					</p>
				</div>

				<ProfileOrdersSection onCancelOrder={setOrderToCancel} />
			</div>

			<ConfirmDialog
				isOpen={orderToCancel !== null}
				isLoading={isCancelingOrder}
				title="Cancel Order"
				description={`Are you sure you want to cancel order #${orderToCancel?.id.slice(0, 8).toUpperCase() || ""}? This action cannot be undone.`}
				confirmText="Confirm Cancellation"
				isDestructive
				onConfirm={handleCancelOrder}
				onClose={closeCancelDialog}
			/>
		</div>
	);
}
