import { useIsWishlistItem } from "@/features/wishlists/services/queries";
import { useToggleWishlist } from "@/features/wishlists/services/mutations";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { useLanguage } from "@/shared/hooks/use-language";
import { Loader2Icon, ShoppingBagIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "react-router";
import type { Product } from "../../schemas/productSchema";
import { useAddToCart } from "@/features/cart/services/mutations";
import { formatPrice } from "@/shared/utils/price";
import { WishlistToggleButton } from "@/features/wishlists/components/WishlistToggleButton";
import { APP_ROUTES } from "@/app/routes/paths";

interface ProductCardProps {
	product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
	const isFavorite = useIsWishlistItem(product.id);
	const { t } = useLanguage();

	const toggleWishlistMutation = useToggleWishlist();
	const addToCartMutation = useAddToCart();

	const isAddingToCart = addToCartMutation.isPending;
	const isTogglingWishlist = toggleWishlistMutation.isPending;

	const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isTogglingWishlist) return;
		toggleWishlistMutation.mutate(product);
	};

	const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isAddingToCart) return;
		addToCartMutation.mutate({ id: null, product, quantity: 1 });
	};

	const wishlistLabel = isFavorite ? "Remove from wishlist" : "Add to wishlist";

	return (
		<article className="group relative flex h-full flex-col justify-between rounded-xl border border-brand-950/5 bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
			<div>
				{/* Image Container */}
				<div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-xl bg-slate-50 border border-gray-100/60">
					{/* Category Badge */}
					{product.category?.label && (
						<span className="absolute left-3 top-3 z-10 rounded-full bg-white/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-brand-900 border border-white/25 shadow-sm pointer-events-none">
							{product.category.label}
						</span>
					)}

					{/* Wishlist Button with Animation */}
					<WishlistToggleButton
						label={wishlistLabel}
						isFavorite={isFavorite}
						onClick={handleWishlistClick}
						isPending={isTogglingWishlist}
						isAnimated
						className="absolute right-3 top-3 z-20 size-9 rounded-full"
					/>

					{/* Product Image Link */}
					<Link
						to={APP_ROUTES.PRODUCT({ id: product.id })}
						tabIndex={-1}
						aria-hidden="true"
						className="block h-full w-full"
					>
						<img
							src={product.imageUrl}
							alt={product.name}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
						/>
					</Link>
				</div>

				{/* Product Details */}
				<div className="mt-4 px-1">
					{product.category?.label && (
						<p className="text-[11px] font-bold uppercase tracking-wider text-brand-800">
							{product.category.label}
						</p>
					)}

					<div className="mt-1 flex items-baseline justify-between gap-2">
						<h3 className="text-lg sm:text-xl font-playfair font-semibold leading-tight text-slate-950">
							<Link
								to={APP_ROUTES.PRODUCT({ id: product.id })}
								className="hover:text-brand-800 transition-colors focus:outline-none focus:underline"
							>
								{product.name}
							</Link>
						</h3>

						<p className="text-base font-bold text-slate-900 shrink-0">
							{formatPrice(product.price)}
						</p>
					</div>
				</div>
			</div>

			{/* Add To Cart Action */}
			<OriginButton
				onClick={handleAddToCartClick}
				disabled={isAddingToCart}
				aria-label={`Add ${product.name} to cart`}
				className={cn(
					"mt-5 w-full h-10 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95",
					isAddingToCart && "opacity-75 cursor-not-allowed",
				)}
			>
				{isAddingToCart ? (
					<>
						<Loader2Icon className="size-3.5 animate-spin" />
						{t("common.adding")}
					</>
				) : (
					<>
						<ShoppingBagIcon className="size-3.5" />
						{t("common.addToCart")}
					</>
				)}
			</OriginButton>
		</article>
	);
}
