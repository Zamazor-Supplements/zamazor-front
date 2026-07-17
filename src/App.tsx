import "./assets/styles/App.css";
import router from "./core/routes/router";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router";
import { useEffect } from "react";
import { LanguageProvider } from "./shared/context/LanguageContext";
import { initAuth, useAuthStore } from "./features/auth/stores/authStore";
import { LoadingScreen } from "./features/auth/components/RequireAuth";
import { AuthStatus } from "./features/auth/types";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./core/config/queryClient";

function App() {
	const authStatus = useAuthStore((state) => state.status);

	useEffect(() => {
		initAuth();
	}, []);

	if (authStatus === AuthStatus.Loading) return <LoadingScreen />;

	return (
		<LanguageProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster position="bottom-left" />
			</QueryClientProvider>
		</LanguageProvider>
	);
}

export default App;
