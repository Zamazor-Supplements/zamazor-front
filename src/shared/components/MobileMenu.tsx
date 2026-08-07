import { APP_ROUTES } from "@/app/routes/paths";
// import {
// 	useAuthStore,
// 	useIsAuthenticated,
// } from "@/features/auth/stores/authStore";
import { WishlistCountButton } from "@/features/wishlists/components/WishlistCountButton";
import {
	AwardIcon,
	Layers3Icon,
	MessageSquareIcon,
	StoreIcon,
} from "lucide-react";
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

export const MobileMenu = ({
	isOpen,
	onClose,
	profileDisplayName,
	profileTargetRoute,
}: MobileMenuProps) => {
	const navigate = useNavigate();
	// const { user } = useAuthStore();
	// const authenticated = useIsAuthenticated();
	const { data: user } = useCurrentUser();
	const authenticated = !!user;

	if (!isOpen) return null;

	const handleAuthAction = (route: string) => {
		onClose();
		navigate(route);
	};

	return (
		<div className="animate-in fade-in slide-in-from-top-3 space-y-5 border-t border-emerald-900/5 px-4 py-5 duration-200 lg:hidden">
			{/* Navigation Items */}
			<nav className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
				{/* Render Primary Store Link First */}
				<Link
					to={MOBILE_NAV_ITEMS[0].path}
					onClick={onClose}
					className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-emerald-50 hover:text-emerald-900 active:scale-[0.99]"
				>
					<StoreIcon className="size-4 text-emerald-850" />
					<span>{MOBILE_NAV_ITEMS[0].label}</span>
				</Link>

				{/* Wishlist Link Component */}
				<WishlistCountButton isMobile onClick={onClose} />

				{/* Render Anchor Section Links */}
				{MOBILE_NAV_ITEMS.slice(1).map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.path}
							to={item.path}
							onClick={onClose}
							className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-emerald-50 hover:text-emerald-900 active:scale-[0.99]"
						>
							<Icon className="size-4 text-emerald-850" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Mobile Auth Actions */}
			<div className="border-t border-emerald-900/5 pt-4">
				{authenticated ? (
					<div className="space-y-3">
						<div className="px-3 text-xs font-medium text-slate-500">
							Signed in as{" "}
							<span className="font-bold text-slate-800">
								{user?.fullName ?? "User"}
							</span>
						</div>
						<OriginButton
							onClick={() => handleAuthAction(profileTargetRoute)}
							variant="emerald"
							className="h-10 w-full cursor-pointer justify-center rounded-xl text-xs font-bold shadow-xs active:scale-95"
						>
							{profileDisplayName}
						</OriginButton>
					</div>
				) : (
					<OriginButton
						onClick={() => handleAuthAction(APP_ROUTES.AUTH.LOGIN)}
						variant="emerald"
						className="h-10 w-full cursor-pointer justify-center rounded-xl text-xs font-bold shadow-xs active:scale-95"
					>
						Sign in
					</OriginButton>
				)}
			</div>
		</div>
	);
};
