import { useCallback } from "react";
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
import { useLanguage } from "@/shared/hooks/use-language";
import { useLogout } from "@/features/auth/services/mutations";
import { useCreateOrUpdateAddress } from "@/features/addresses/services/mutations";
import { useUpdateCurrentUser } from "@/features/profile/services/mutations";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileFormSection } from "../components/ProfileFormSection";

export default function ProfilePage() {
	const { t } = useLanguage();
	useDocumentTitle(`${t("profile.title")} | ${CONFIG.APP_NAME}`);

	const user = useAuthenticatedUser();
	const logoutMutation = useLogout();
	const createOrUpdateAddressMutation = useCreateOrUpdateAddress();
	const updateCurrentUserMutation = useUpdateCurrentUser();

	const isSaving =
		createOrUpdateAddressMutation.isPending ||
		updateCurrentUserMutation.isPending;

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

	const handleLogout = useCallback(() => {
		logoutMutation.mutate();
	}, [logoutMutation]);

	const handleProfileSubmit = useCallback(
		(data: ProfileFormValues) => {
			const addressPayload = {
				country: APP_COUNTRY,
				city: data.city?.trim() ?? "",
				street: data.street?.trim() ?? "",
				phone: data.phone?.trim() ?? "",
				isDefault: true,
			};

			const trimmedName = data.fullName.trim();
			if (trimmedName && trimmedName !== user.fullName) {
				updateCurrentUserMutation.mutate({ fullName: trimmedName });
			}

			createOrUpdateAddressMutation.mutate(addressPayload);
		},
		[user.fullName, updateCurrentUserMutation, createOrUpdateAddressMutation],
	);

	return (
		<div className="min-h-screen bg-surface py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl space-y-8">
				<Breadcrumbs
					items={[
						{ label: "Home", href: APP_ROUTES.HOME },
						{ label: "Profile" },
					]}
				/>

				<ProfileHeader
					user={user}
					onLogout={handleLogout}
					isLoggingOut={logoutMutation.isPending}
				/>

				<ProfileFormSection
					userFullName={user.fullName}
					userEmail={user.email}
					emailVerified={user.emailVerified ?? false}
					register={form.register}
					errors={form.formState.errors}
					handleSubmit={form.handleSubmit}
					onSubmit={handleProfileSubmit}
					isSaving={isSaving}
					isDirty={form.formState.isDirty}
				/>
			</div>
		</div>
	);
}
