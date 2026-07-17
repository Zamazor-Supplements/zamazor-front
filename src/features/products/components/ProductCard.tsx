import type { Product } from "../schemas/productSchema";
import { useNavigate } from "react-router";
import { useLanguage } from "@/shared/context/LanguageContext";
import { motion } from "framer-motion";
import { HeartIcon, ShoppingBagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { useAddToCart } from "@/services/cart/mutations";
import type { MouseEvent } from "react";
import {
	useIsWishlistItem,
	useToggleWishlist,
} from "@/features/wishlists/hooks/use-wishlist";

export function ProductCard({ product }: { product: Product }) {
	const isFavorite = useIsWishlistItem(product.id);
	const navigate = useNavigate();
	const { language, t } = useLanguage();
	const toggleToWishlistMutation = useToggleWishlist();
	const addToCartMutation = useAddToCart();

	const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		toggleToWishlistMutation.mutate(product.id);
	};

	const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (addToCartMutation.isPending) return;
		addToCartMutation.mutate({ productId: product.id, quantity: 1 });
	};

	return (
		<motion.article
			key={product.name}
			whileHover={{ y: -8 }}
			transition={{ duration: 0.12, ease: "easeOut" }}
			onClick={() => navigate(`/product/${product.id}`)}
			className="snap-start shrink-0 w-72.5 sm:w-82.5 rounded-[2rem] border border-emerald-950/5 bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-150 flex flex-col justify-between group cursor-pointer"
		>
			<div>
				<div className="relative h-80 overflow-hidden rounded-[1.5rem] bg-white border border-gray-100/60">
					<span className="absolute left-3 top-3 z-10 rounded-full bg-white/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-900 border border-white/20 shadow-sm">
						{product.category.label}
					</span>
					<button
						type="button"
						onClick={handleWishlistClick}
						className="absolute right-3 top-3 z-10 size-9 rounded-full bg-white/95 text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
						title={
							isFavorite
								? language === "fr"
									? "Retirer des favoris"
									: "Remove from Wishlist"
								: language === "fr"
									? "Ajouter aux favoris"
									: "Add to Wishlist"
						}
					>
						<HeartIcon
							className={cn(
								"size-4 transition-colors",
								isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500",
							)}
						/>
					</button>
					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
					/>
				</div>
				<div className="mt-5 px-1">
					<p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
						{product.category.label}
					</p>
					<div className="mt-2 flex items-baseline justify-between gap-2">
						<h3 className="text-xl font-playfair font-semibold leading-tight text-slate-950">
							{product.name}
						</h3>
						<p className="text-base font-bold text-slate-900 shrink-0">
							{product.price} MAD
						</p>
					</div>
				</div>
			</div>

			<OriginButton
				variant="emerald"
				onClick={handleAddToCartClick}
				className={cn(
					"mt-5 w-full h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer",
					addToCartMutation.isPending && "opacity-70 cursor-not-allowed",
				)}
			>
				<ShoppingBagIcon className="size-3.5" />
				{addToCartMutation.isPending
					? t("common.adding")
					: t("common.addToCart")}
			</OriginButton>
		</motion.article>
	);
}
