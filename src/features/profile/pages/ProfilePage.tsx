import { useState } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	profileSchema,
	type ProfileFormValues,
} from "@/features/auth/schemas/profileSchema";
import CONFIG, { APP_COUNTRY } from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { useAuthenticatedUser } from "@/features/auth/services/queries";
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { useLanguage } from "@/shared/hooks/use-language";
import { useLogout } from "@/features/auth/services/mutations";
import { useCreateOrUpdateAddress } from "@/features/addresses/services/mutations";
import { useUpdateCurrentUser } from "@/features/profile/services/mutations";
import { useCancelOrder } from "@/features/orders/services/mutations";
import type { Order } from "@/features/orders/schemas/orderSchema";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileTabs } from "../components/ProfileTabs";
import { ProfileFormSection } from "../components/ProfileFormSection";
import { ProfileOrdersSection } from "../components/ProfileOrdersSection";

type ProfileTab = "profile" | "orders";

export default function ProfilePage() {
	const { t } = useLanguage();
	useDocumentTitle(`${t("profile.title")} | ${CONFIG.APP_NAME}`);

	const user = useAuthenticatedUser();
	const logoutMutation = useLogout();

	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab: ProfileTab = searchParams.get("tab") === "orders" ? "orders" : "profile";
	const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

	const handleTabChange = (tab: ProfileTab) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (tab === "orders") {
					next.set("tab", "orders");
				} else {
					next.delete("tab");
				}
				return next;
			},
			{ replace: true }
		);
	};

	const createOrUpdateAddressMutation = useCreateOrUpdateAddress();
	const updateCurrentUserMutation = useUpdateCurrentUser();
	const cancelOrderMutation = useCancelOrder();

	const isSaving = createOrUpdateAddressMutation.isPending ||
		updateCurrentUserMutation.isPending;
	const isCancelingOrder = cancelOrderMutation.isPending;

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			fullName: user.fullName,
			street: user.address?.street ?? "",
			city: user.address?.city ?? "",
			phone: user.address?.phone ?? "",
			country: user.address?.country ?? APP_COUNTRY,
		},
	});

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const handleProfileSubmit = (data: ProfileFormValues) => {
		const addressPayload = {
			// Country is a fixed application-level constraint; force it here so
			// the submitted payload is locked to APP_COUNTRY regardless of what
			// the form state holds (defense against future defaultValues regressions).
			country: APP_COUNTRY,
			city: (data.city || "").trim(),
			street: (data.street || "").trim(),
			phone: (data.phone || "").trim(),
			isDefault: true,
		};

		// Send address update and name update in parallel if name changed.
		const trimmedName = (data.fullName || "").trim();
		const nameChanged = trimmedName && trimmedName !== user.fullName;

		if (nameChanged) {
			updateCurrentUserMutation.mutate({ fullName: trimmedName });
		}
		createOrUpdateAddressMutation.mutate(addressPayload);
	};

	const promptCancelOrder = (order: Order) => {
		setOrderToCancel(order);
	};

	const closeCancelDialog = () => {
		setOrderToCancel(null);
	};

	const handleCancelOrder = async () => {
		if (!orderToCancel || orderToCancel.status !== "PENDING") {
			closeCancelDialog();
			return;
		}

		cancelOrderMutation.mutate(orderToCancel.id, {
			onSuccess: closeCancelDialog,
		});
	};

	return (
		<div className="min-h-screen bg-surface py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-8">
				<Breadcrumbs
					items={[
						{ label: "Home", href: APP_ROUTES.HOME },
						{ label: "Profile" },
					]} />

				<ProfileHeader
					user={user}
					onLogout={handleLogout}
					isLoggingOut={logoutMutation.isPending} />

				<ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

				{activeTab === "profile" ? (
					<ProfileFormSection
						userFullName={user.fullName}
						userEmail={user.email}
						register={form.register}
						errors={form.formState.errors}
						handleSubmit={form.handleSubmit}
						onSubmit={handleProfileSubmit}
						isSaving={isSaving}
						isDirty={form.formState.isDirty} />
				) : (
					<ProfileOrdersSection onCancelOrder={promptCancelOrder} />
				)}
			</div>

			<ConfirmDialog
				isOpen={orderToCancel !== null}
				isLoading={isCancelingOrder}
				title="Cancel Order"
				description={`Are you sure you want to cancel order #${orderToCancel?.id.slice(0, 8).toUpperCase() || ""}? This action cannot be undone.`}
				confirmText="Confirm Cancellation"
				isDestructive
				onConfirm={handleCancelOrder}
				onClose={() => {
					if (!isCancelingOrder) {
						setOrderToCancel(null);
					}
				} } />
		</div>
	);
}
