import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Loader2Icon, ShoppingBagIcon } from "lucide-react";
import { formatPrice } from "@/shared/utils/price";
import { useAddToCart } from "@/features/cart/services/mutations";
import type { Product } from "../../schemas/productSchema";
import { QuantitySelector } from "@/shared/components/ui/quantity-selector";
import { useLanguage } from "@/shared/hooks/use-language";
import { AnimatePresence, motion } from "framer-motion";

const HIDDEN_PREFIXES = ["/cart", "/checkout"];

interface StickyAddToCartBarProps {
	product: Product;
}

export const StickyAddToCartBar = ({ product }: StickyAddToCartBarProps) => {
	const { t } = useLanguage();
	const { pathname } = useLocation();
	const addToCartMutation = useAddToCart();

	const [quantity, setQuantity] = useState(1);
	const [show, setShow] = useState(false);

	const isRouteHidden = HIDDEN_PREFIXES.some((prefix) =>
		pathname.startsWith(prefix),
	);

	useEffect(() => {
		if (isRouteHidden) return;

		const onScroll = () => {
			setShow(window.scrollY > 640);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [isRouteHidden]);

	const shouldDisplay = show && !isRouteHidden;

	const handleAdd = () => {
		addToCartMutation.mutate({ product, quantity });
	};

	return (
		<AnimatePresence>
			{shouldDisplay && (
				<motion.div
					initial={{ y: "100%", opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: "100%", opacity: 0 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
					className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-900/10 bg-white/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-lift backdrop-blur-md lg:hidden"
				>
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-2.5">
						<div className="min-w-0 flex-1">
							<p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
								{product.name}
							</p>
							<p className="text-sm font-black text-slate-950">
								{formatPrice(product.price * quantity)}
							</p>
						</div>

						<div className="flex items-center gap-2">
							<QuantitySelector
								value={quantity}
								onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
								onIncrease={() => setQuantity((q) => q + 1)}
								size="sm"
							/>

							<button
								type="button"
								onClick={handleAdd}
								disabled={addToCartMutation.isPending}
								className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-brand-900 px-3.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-950 active:scale-95 disabled:opacity-70"
							>
								{addToCartMutation.isPending ? (
									<Loader2Icon className="size-3.5 animate-spin" />
								) : (
									<ShoppingBagIcon className="size-3.5" />
								)}
								<span>{t("common.addToCart")}</span>
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
