import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { MenuIcon } from "lucide-react";
import { useLogout } from "@/features/auth/services/mutations";
import { SidebarNav } from "@/shared/components/ui/dashboard-sidebar";

export const DashboardLayout = () => {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const logoutMutation = useLogout();

	const handleLogout = useCallback(() => {
		logoutMutation.mutate();
	}, [logoutMutation]);

	const closeMobileSidebar = useCallback(() => {
		setIsMobileSidebarOpen(false);
	}, []);

	// Handle body scroll lock & Escape key shortcut for mobile drawer
	useEffect(() => {
		if (!isMobileSidebarOpen) return;

		document.body.style.overflow = "hidden";

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeMobileSidebar();
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isMobileSidebarOpen, closeMobileSidebar]);

	return (
		<div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
			{/* Desktop Sidebar */}
			<SidebarNav className="hidden md:flex" onLogout={handleLogout} />

			{/* Mobile Drawer Backdrop */}
			{isMobileSidebarOpen && (
				<button
					type="button"
					onClick={closeMobileSidebar}
					className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
					aria-label="Close navigation menu"
				/>
			)}

			{/* Mobile Sidebar Drawer */}
			<aside
				id="mobile-sidebar"
				role="dialog"
				aria-modal="true"
				aria-label="Dashboard navigation menu"
				className={`fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-in-out md:hidden ${
					isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<SidebarNav onLogout={handleLogout} onNavClick={closeMobileSidebar} />
			</aside>

			{/* Main Content Area */}
			<div className="relative flex flex-1 flex-col overflow-y-auto">
				{/* Mobile Sidebar Trigger */}
				<button
					type="button"
					onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
					className="fixed left-4 top-4 z-40 rounded-xl border border-slate-200 bg-white/95 p-2.5 text-slate-600 shadow-sm backdrop-blur-sm hover:bg-white hover:text-slate-900 md:hidden"
					aria-label="Open navigation menu"
					aria-expanded={isMobileSidebarOpen}
					aria-controls="mobile-sidebar"
				>
					<MenuIcon className="size-5" />
				</button>

				{/* Page Container */}
				<main className="mx-auto w-full max-w-7xl flex-1 p-4 pt-16 sm:p-6 sm:pt-8 lg:p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
