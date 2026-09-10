import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { MenuIcon } from "lucide-react";
import { useLogout } from "@/features/auth/services/mutations";
import { SidebarNav } from "@/shared/components/ui/dashboard-sidebar";
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { APP_ROUTES } from "@/app/routes/paths";
import { AdminEventsProvider } from "@/features/dashboard/sse/AdminEventsProvider";

const DASHBOARD_BREADCRUMBS: Record<string, string> = {
	"/dashboard": "Overview",
	"/dashboard/products": "Products",
	"/dashboard/categories": "Categories",
	"/dashboard/orders": "Orders",
	"/dashboard/settings": "Settings",
};

export function DashboardLayout() {
	const location = useLocation();
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const logoutMutation = useLogout();

	const dashboardLabel = DASHBOARD_BREADCRUMBS[location.pathname];
	const breadcrumbItems = [
		{ label: "Home", href: APP_ROUTES.HOME },
		{ label: "Dashboard", href: APP_ROUTES.DASHBOARD.ROOT },
		...(dashboardLabel ? [{ label: dashboardLabel }] : []),
	];

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
		<div className="flex h-screen overflow-hidden bg-surface-2 font-sans text-ink">
			{/* Desktop Sidebar */}
			<SidebarNav className="hidden md:flex" onLogout={handleLogout} />

			{/* Mobile Drawer Backdrop */}
			{isMobileSidebarOpen && (
				<button
					type="button"
					onClick={closeMobileSidebar}
					className="fixed inset-0 z-40 bg-brand-950/60 backdrop-blur-xs md:hidden"
					aria-label="Close navigation menu"
				/>
			)}

			{/* Mobile Sidebar Drawer */}
			<aside
				id="mobile-sidebar"
				role="dialog"
				aria-modal="true"
				aria-label="Dashboard navigation menu"
				aria-hidden={!isMobileSidebarOpen}
				inert={!isMobileSidebarOpen}
				className={`fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<SidebarNav onLogout={handleLogout} onNavClick={closeMobileSidebar} />
			</aside>

			{/* Main Content Area */}
			<div className="relative flex flex-1 flex-col overflow-y-auto">
				{/* Mobile Sidebar Trigger */}
				<button
					type="button"
					onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
					className="fixed left-4 top-4 z-40 rounded-lg border border-brand-900/10 bg-card/95 p-2.5 text-ink-soft shadow-sm backdrop-blur-sm hover:bg-card hover:text-ink md:hidden"
					aria-label="Open navigation menu"
					aria-expanded={isMobileSidebarOpen}
					aria-controls="mobile-sidebar"
				>
					<MenuIcon className="size-5" />
				</button>

				{/* Page Container */}
				<main className="mx-auto w-full max-w-7xl flex-1 p-4 pt-16 sm:p-6 sm:pt-8 lg:p-8">
					<Breadcrumbs items={breadcrumbItems} className="mb-4" />
					<AdminEventsProvider>
						<Outlet />
					</AdminEventsProvider>
				</main>
			</div>
		</div>
	);
}
