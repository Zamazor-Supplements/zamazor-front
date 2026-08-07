import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	profileSchema,
	type ProfileFormValues,
} from "@/features/auth/schemas/profileSchema";
import CONFIG from "@/app/config/constants";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { useAuthenticatedUser } from "@/features/auth/services/queries";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { useLanguage } from "@/shared/hooks/use-language";
import { useLogout } from "@/features/auth/services/mutations";
import { useCreateOrUpdateAddress } from "@/features/addresses/services/mutations";
import { useCancelOrder } from "@/features/orders/services/mutations";
import { useMyOrders } from "@/features/orders/services/queries";
import type { Order } from "@/features/orders/schemas/orderSchema";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileTabs } from "../components/ProfileTabs";
import { ProfileFormSection } from "../components/ProfileFormSection";
import { ProfileOrdersSection } from "../components/ProfileOrdersSection";

const DEFAULT_COUNTRY = "Morocco";
type ProfileTab = "profile" | "orders";

export const ProfilePage = () => {
	const { t } = useLanguage();
	useDocumentTitle(`${t("profile.title")} | ${CONFIG.APP_NAME}`);

	const user = useAuthenticatedUser();
	const logoutMutation = useLogout();

	const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
	const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

	const createOrUpdateAddressMutation = useCreateOrUpdateAddress();
	const cancelOrderMutation = useCancelOrder();

	const isSaving = createOrUpdateAddressMutation.isPending;
	const isCancelingOrder = cancelOrderMutation.isPending;

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			fullName: user.fullName,
			street: user.address?.street ?? "",
			city: user.address?.city ?? "",
			phone: user.address?.phone ?? "",
			country: user.address?.country ?? DEFAULT_COUNTRY,
		},
	});

	const { data: orderPage, isPending: ordersPending } = useMyOrders(
		{},
		{ enabled: activeTab === "orders" },
	);

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	const handleProfileSubmit = (data: ProfileFormValues) => {
		const addressPayload = {
			country: data.country.trim() || DEFAULT_COUNTRY,
			city: (data.city || "").trim(),
			street: (data.street || "").trim(),
			phone: (data.phone || "").trim(),
			isDefault: true,
		};

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
		<div className="min-h-screen bg-slate-50/60 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-8">
				<ProfileHeader
					user={user}
					onLogout={handleLogout}
					isLoggingOut={logoutMutation.isPending}
				/>

				<ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

				{activeTab === "profile" ? (
					<ProfileFormSection
						userFullName={user.fullName}
						userEmail={user.email}
						register={form.register}
						errors={form.formState.errors}
						handleSubmit={form.handleSubmit}
						onSubmit={handleProfileSubmit}
						isSaving={isSaving}
						isDirty={form.formState.isDirty}
					/>
				) : (
					<ProfileOrdersSection
						orderPage={orderPage}
						isPending={ordersPending}
						onCancelOrder={promptCancelOrder}
					/>
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
				}}
			/>
		</div>
	);
};
