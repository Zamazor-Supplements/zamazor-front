import { APP_ROUTES } from "@/app/routes/paths";
import { useCurrentUser } from "@/features/auth/services/queries";

export const useUserProfile = () => {
	const { data: user } = useCurrentUser();

	const authenticated = !!user;
	const isAdmin = authenticated && user.role === "ADMIN";

	const profileDisplayName = isAdmin
		? "Dashboard"
		: user?.fullName?.trim().split(/\s+/)[0] || "Profile";

	const profileTargetRoute = isAdmin
		? APP_ROUTES.DASHBOARD.ROOT
		: APP_ROUTES.USER.PROFILE;

	return {
		user,
		isAuthenticated: authenticated,
		isAdmin,
		profileDisplayName,
		profileTargetRoute,
	};
};
