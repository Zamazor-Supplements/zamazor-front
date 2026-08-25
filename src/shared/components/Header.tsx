import { forwardRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import logo from "@/assets/images/zamazor.svg";
import { APP_ROUTES } from "@/app/routes/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { OriginButton } from "@/shared/components/ui/origin-button";
import {
	MenuIcon,
	XIcon,
	UserIcon,
	StoreIcon,
	SparklesIcon,
	MessageSquareIcon,
	AwardIcon,
	Layers3Icon,
} from "lucide-react";
import { BouncingCart } from "../../features/cart/components/shared/BouncingCart";
import { WishlistCountButton } from "@/features/wishlists/components/WishlistCountButton";
import { HeaderSearchBar } from "./HeaderSearchBar";
import { HeaderLanguageSwitcher } from "./HeaderLanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { useUserProfile } from "../hooks/use-user-profile";
import { useLanguage } from "@/shared/hooks/use-language";

const NAV_LINKS = [
	{ label: "Store", path: APP_ROUTES.SHOP, icon: StoreIcon },
	{ label: "Best Sellers", path: "/#products", icon: SparklesIcon },
	{ label: "Daily Stacks", path: "/#stack", icon: Layers3Icon },
	{ label: "Reviews", path: "/#reviews", icon: MessageSquareIcon },
	{ label: "Clinical Results", path: "/#proof", icon: AwardIcon },
];

export const Header = forwardRef<HTMLElement, { className?: string }>(
	({ className }, ref) => {
		const navigate = useNavigate();
		const { language, setLanguage } = useLanguage();
		const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

		const { isAuthenticated, profileDisplayName, profileTargetRoute } =
			useUserProfile();

		// Handlers
		const handleSearchSubmit = (trimmedSearch: string) => {
			setIsMobileMenuOpen(false);
			navigate(
				`${APP_ROUTES.SHOP}?search=${encodeURIComponent(trimmedSearch)}`,
			);
		};

		const handleSelectProduct = (productId: string) => {
			setIsMobileMenuOpen(false);
			navigate(APP_ROUTES.PRODUCT({ id: productId }));
		};

		return (
			<header
				ref={ref}
				className={cn(
					"sticky top-2 z-40 mx-auto mt-2 w-[calc(100%-2rem)] max-w-7xl rounded-xl border border-brand-900/10 bg-surface/95 shadow-md backdrop-blur transition-all duration-300",
					className,
				)}
			>
				{/* Main Header Row */}
				<div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:gap-6 lg:px-6">
					{/* Left: Brand Logo & Mobile Toggle */}
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							aria-label="Toggle navigation menu"
							aria-expanded={isMobileMenuOpen}
							aria-controls="mobile-menu"
							className="cursor-pointer lg:hidden"
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
						>
							{isMobileMenuOpen ? (
								<XIcon className="size-5 text-brand-900" />
							) : (
								<MenuIcon className="size-5 text-brand-900" />
							)}
						</Button>

						<Link
							to={APP_ROUTES.HOME}
							className="flex shrink-0 items-center gap-2.5"
						>
							<img
								src={logo}
								alt="Zamazor logo"
								className="size-9 rounded-lg border border-brand-900/10 bg-card"
							/>
							<span className="font-playfair text-xl font-black tracking-tight text-brand-950">
								Zamazor
							</span>
						</Link>
					</div>

					{/* Desktop Search Bar */}
					<HeaderSearchBar
						onSubmitSearch={handleSearchSubmit}
						onSelectProduct={handleSelectProduct}
					/>

					{/* Right Action Icons */}
					<div className="flex items-center justify-end gap-1 sm:gap-2.5">
						<WishlistCountButton className="hidden sm:flex" />

						<HeaderLanguageSwitcher
							language={language}
							onLanguageChange={setLanguage}
						/>

						{/* Desktop Auth Button */}
						<OriginButton
							onClick={() =>
								navigate(
									isAuthenticated ? profileTargetRoute : APP_ROUTES.AUTH.LOGIN,
								)
							}
							className="hidden h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-xs font-semibold sm:inline-flex"
						>
							<UserIcon className="size-3.5" />
							{isAuthenticated ? profileDisplayName : "Sign In"}
						</OriginButton>
						<BouncingCart />
					</div>
				</div>

				{/* Mobile Search Bar (Row 2 on Mobile screens) */}
				<HeaderSearchBar
					isMobile
					onSubmitSearch={handleSearchSubmit}
					onSelectProduct={handleSelectProduct}
				/>

				{/* Desktop Category Navigation */}
				<nav className="hidden items-center justify-between border-t border-brand-900/5 bg-transparent px-6 py-2 font-sans lg:flex">
					<div className="flex items-center gap-1.5">
						{NAV_LINKS.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.path}
									to={link.path}
									className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold text-ink-soft transition-colors hover:bg-brand-50/50 hover:text-brand-900"
								>
									<Icon className="size-3.5 text-brand-800" />
									{link.label}
								</Link>
							);
						})}
					</div>
					<span className="text-[10px] font-black uppercase tracking-widest text-brand-950/40">
						100% Organic & Clean Formulas
					</span>
				</nav>

				{/* Mobile Menu Drawer */}
				<MobileMenu
					isOpen={isMobileMenuOpen}
					onClose={() => setIsMobileMenuOpen(false)}
					profileDisplayName={profileDisplayName}
					profileTargetRoute={profileTargetRoute}
				/>
			</header>
		);
	},
);

Header.displayName = "Header";
