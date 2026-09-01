import { Navigate, Outlet, useLocation } from "react-router";
import { notify } from "@/lib/notify";
import { APP_ROUTES } from "@/app/routes/paths";
import type { Role, User } from "../../schemas/userSchema";
import { authKeys } from "../../services/keys";
import { useQueryClient } from "@tanstack/react-query";

interface RequireAuthProps {
	readonly allowedRoles?: Role[];
	readonly requiresVerification?: boolean;
}

export const RequireAuth = ({
	allowedRoles,
	requiresVerification,
}: RequireAuthProps) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData<User>(authKeys.me());
	const location = useLocation();

	if (!user) {
		notify.error("Access Denied", {
			id: "access-denied",
			description: "You must be logged in to view this page.",
		});
		return (
			<Navigate to={APP_ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
		);
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		notify.error("Access Denied", {
			id: "unauthorized-role",
			description: "You do not have permission to view this page.",
		});
		return <Navigate to={APP_ROUTES.HOME} replace />;
	}

	if (requiresVerification && !user.emailVerified) {
		notify.error("Verification Required", {
			id: "verification-required",
			description: "Please verify your email address to access this feature.",
		});
		return <Navigate to={APP_ROUTES.USER.PROFILE} replace />;
	}

	return <Outlet />;
};
