import { APP_ROUTES } from "@/app/routes/paths";
import { WishlistCountButton } from "@/features/wishlists/components/WishlistCountButton";
import {
	AwardIcon,
	Layers3Icon,
	MessageSquareIcon,
	StoreIcon,
	PackageIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { OriginButton } from "./ui/origin-button";
import { useCurrentUser } from "@/features/auth/services/queries";

interface MobileMenuProps {
	isOpen: boolean;
	onClose: () => void;
	profileDisplayName: string;
	profileTargetRoute: string;
}

const MOBILE_NAV_ITEMS = [
	{ label: "Store", path: APP_ROUTES.SHOP, icon: StoreIcon },
	{ label: "Reviews", path: "/#reviews", icon: MessageSquareIcon },
	{ label: "Clinical Results", path: "/#proof", icon: AwardIcon },
	{ label: "Daily Stacks", path: "/#stack", icon: Layers3Icon },
] as const;

const FOCUSABLE_QUERY =
	'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const MobileMenu = ({
	isOpen,
	onClose,
	profileDisplayName,
	profileTargetRoute,
}: MobileMenuProps) => {
	const navigate = useNavigate();
	const { data: user } = useCurrentUser();
	const menuRef = useRef<HTMLDivElement>(null);

	const handleAuthAction = useCallback(
		(route: string) => {
			onClose();
			navigate(route);
		},
		[onClose, navigate],
	);

	// Focus Management & Keyboard Trap (Esc and Tab handling)
	useEffect(() => {
		if (!isOpen) return;

		const container = menuRef.current;
		if (!container) return;

		// Initial Focus Setup (W3C standard: focus container wrapper first)
		if (!container.contains(document.activeElement)) {
			container.focus();
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
				return;
			}

			if (event.key !== "Tab") return;

			const focusables = Array.from(
				container.querySelectorAll<HTMLElement>(FOCUSABLE_QUERY),
			);
			if (focusables.length === 0) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			const active = document.activeElement;

			if (event.shiftKey && (active === first || !container.contains(active))) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && active === last) {
				event.preventDefault();
				first?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const [storeRoute, ...sectionRoutes] = MOBILE_NAV_ITEMS;
	const authRoute = user ? profileTargetRoute : APP_ROUTES.AUTH.LOGIN;
	const authButtonLabel = user ? profileDisplayName : "Sign in";
	const userName = user?.fullName ?? "User";

	return (
		<div
			ref={menuRef}
			id="mobile-menu"
			role="dialog"
			aria-modal="true"
			aria-label="Mobile navigation"
			tabIndex={-1}
			className="animate-in fade-in slide-in-from-top-3 space-y-5 border-t border-brand-900/5 px-4 py-5 duration-200 lg:hidden focus:outline-none"
		>
			{/* Navigation Items */}
			<nav className="flex flex-col gap-1.5 text-sm font-semibold text-ink-soft">
				{/* Primary Store Link */}
				<Link
					to={storeRoute.path}
					onClick={onClose}
					className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-50 hover:text-brand-900 active:scale-[0.99]"
				>
					<storeRoute.icon className="size-4 text-brand-800" />
					<span>{storeRoute.label}</span>
				</Link>

				{/* Wishlist Link Component */}
				<WishlistCountButton isMobile onClick={onClose} />

				{/* Anchor Section Links */}
				{sectionRoutes.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.path}
							to={item.path}
							onClick={onClose}
							className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-50 hover:text-brand-900 active:scale-[0.99]"
						>
							<Icon className="size-4 text-brand-800" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Mobile Auth Actions */}
			<div className="border-t border-brand-900/5 pt-4">
				<div className="space-y-3">
					{user && (
						<div className="px-3 text-xs font-medium text-ink-faint">
							Signed in as{" "}
							<span className="font-bold text-ink">{userName}</span>
						</div>
					)}
					<div className="flex gap-2">
						<OriginButton
							onClick={() => handleAuthAction(authRoute)}
							className="h-10 flex-1 cursor-pointer justify-center rounded-lg text-xs font-bold shadow-xs active:scale-95"
						>
							{authButtonLabel}
						</OriginButton>
						{user && user.role !== "ADMIN" && (
							<OriginButton
								variant="outline"
								disabled={!user.emailVerified}
								onClick={() => {
									if (user.emailVerified)
										handleAuthAction(APP_ROUTES.USER.ORDERS);
								}}
								title={
									!user.emailVerified
										? "Please verify your email to access orders"
										: "View your orders"
								}
								className="h-10 cursor-pointer justify-center rounded-lg text-xs font-bold shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<PackageIcon className="size-4" />
							</OriginButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
