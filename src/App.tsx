import router from "./app/routes/router";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router";
import { LanguageProvider } from "./shared/context/LanguageContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/config/queryClient";
import { AuthInitializer } from "./features/auth/components/shared/AuthInitializer";
import "@/features/auth/stores/authListener";

function App() {
	return (
		<LanguageProvider>
			<QueryClientProvider client={queryClient}>
				<AuthInitializer>
					<RouterProvider router={router} />
				</AuthInitializer>
				<Toaster position="bottom-left" />
			</QueryClientProvider>
		</LanguageProvider>
	);
}

export default App;
