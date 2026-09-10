import { create } from "zustand";
import { AuthStatus } from "../types/auth";
import { devtools } from "zustand/middleware";

type AuthState = {
	status:
		| typeof AuthStatus.Loading
		| typeof AuthStatus.Authenticated
		| typeof AuthStatus.Unauthenticated;

	setAuthenticated: () => void;
	setUnauthenticated: () => void;
	setLoading: () => void;
};

export const useAuthStore = create<AuthState>()(
	devtools((set) => ({
		status: AuthStatus.Loading,

		setAuthenticated: () =>
			set(
				{ status: AuthStatus.Authenticated },
				undefined,
				"auth/setAuthenticated",
			),
		setUnauthenticated: () =>
			set(
				{ status: AuthStatus.Unauthenticated },
				undefined,
				"auth/setUnauthenticated",
			),
		setLoading: () =>
			set({ status: AuthStatus.Loading }, undefined, "auth/setLoading"),
	})),
);
