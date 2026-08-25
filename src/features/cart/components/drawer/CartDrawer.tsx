import { Link, useNavigate } from "react-router";
import { Loader2Icon, ShoppingBagIcon } from "lucide-react";
import { useCart } from "@/features/cart/services/queries";
import { useCartDrawerStore } from "@/features/cart/stores/cartDrawerStore";
import { Sheet } from "@/shared/components/ui/sheet";
import { ShippingProgress } from "@/shared/components/ui/shipping-progress";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { ShoppingCartItem } from "@/features/cart/components/cart/ShoppingCartItem";
import { formatPrice } from "@/shared/utils/price";
import { APP_ROUTES } from "@/app/routes/paths";
import { useLanguage } from "@/shared/hooks/use-language";
import { CartDrawerSkeleton } from "./CartDrawerSkeleton";

export const CartDrawer = () => {
	const { t } = useLanguage();
	const isOpen = useCartDrawerStore((s) => s.isOpen);
	const close = useCartDrawerStore((s) => s.close);
	const { data: cart, isLoading, isFetching, isError } = useCart();
	const navigate = useNavigate();

	const items = cart?.items ?? [];
	const subtotal = cart?.subtotal ?? 0;

	const handleCheckout = () => {
		close();
		navigate(APP_ROUTES.CHECKOUT.ROOT);
	};

	return (
		<Sheet
			open={isOpen}
			onOpenChange={(open) => !open && close()}
			side="right"
			size="xl"
			title={t("cartDrawer.title")}
			description={t("cartDrawer.description")}
		>
			{isLoading ? (
				<CartDrawerSkeleton />
			) : isError ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:px-8">
					<div className="grid size-16 place-items-center rounded-full bg-rose-50 text-rose-500 shadow-inner">
						<ShoppingBagIcon className="size-7" />
					</div>
					<div>
						<p className="font-playfair text-lg font-bold text-ink">
							Unable to load cart
						</p>
						<p className="mt-1 text-sm text-ink-soft max-w-xs mx-auto">
							Something went wrong while fetching your cart. Please try again.
						</p>
					</div>
					<OriginButton
						onClick={close}
						className="w-full max-w-xs h-11 rounded-lg"
					>
						{t("cartDrawer.continueShopping")}
					</OriginButton>
				</div>
			) : items.length === 0 ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center sm:px-8">
					<div className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-500 shadow-inner">
						<ShoppingBagIcon className="size-7" />
					</div>
					<div>
						<p className="font-playfair text-lg font-bold text-ink">
							{t("cartDrawer.emptyTitle")}
						</p>
						<p className="mt-1 text-sm text-ink-soft max-w-xs mx-auto">
							{t("cartDrawer.emptyDesc")}
						</p>
					</div>
					<OriginButton
						onClick={close}
						className="w-full max-w-xs h-11 rounded-lg"
					>
						{t("cartDrawer.continueShopping")}
					</OriginButton>
				</div>
			) : (
				<div className="flex flex-col h-full overflow-hidden">
					{/* Scrollable Items Container */}
					<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 relative">
						{/* Subtle background fetching indicator */}
						{isFetching && (
							<div className="absolute top-2 right-4 flex items-center gap-1.5 text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full shadow-xs animate-pulse z-10">
								<Loader2Icon className="size-3 animate-spin" />
								<span>{t("cartDrawer.updating") || "Updating..."}</span>
							</div>
						)}

						<ShippingProgress subtotal={subtotal} />
						<div className="space-y-3 pt-1">
							{items.map((item) => (
								<ShoppingCartItem key={item.product.id} item={item} />
							))}
						</div>
					</div>

					{/* Sticky Checkout Footer */}
					<div className="sticky bottom-0 space-y-3 border-t border-slate-100 bg-card px-4 py-4 sm:px-6 sm:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10">
						<div className="flex items-center justify-between">
							<span className="text-sm font-semibold text-ink-soft">
								{t("cart.subtotal")}
							</span>
							<span className="text-xl font-black text-ink">
								{formatPrice(subtotal)}
							</span>
						</div>

						<OriginButton
							onClick={handleCheckout}
							className="h-12 w-full rounded-lg font-bold tracking-wide shadow-sm"
						>
							{t("cart.checkoutBtn")}
						</OriginButton>

						<Link
							to={APP_ROUTES.CART}
							onClick={close}
							className="block text-center text-xs font-semibold text-ink-soft transition-colors hover:text-ink pt-1"
						>
							{t("cartDrawer.viewFullCart")}
						</Link>
					</div>
				</div>
			)}
		</Sheet>
	);
};
