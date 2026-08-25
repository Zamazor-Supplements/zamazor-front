import {
	useRemoveFromCart,
	useUpdateCartItemQuantity,
} from "@/features/cart/services/mutations";
import type { CartItem } from "../../schemas/cartSchema";
import { Link } from "react-router";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { formatPrice } from "@/shared/utils/price";
import { APP_ROUTES } from "@/app/routes/paths";
import { QuantitySelector } from "@/shared/components/ui/quantity-selector";
import { Image } from "@/shared/components/ui/image";
import { cn } from "@/lib/utils";

export const ShoppingCartItem = ({ item }: { item: CartItem }) => {
	const updateQuantityMutation = useUpdateCartItemQuantity();
	const removeItemMutation = useRemoveFromCart();
	const { product, quantity } = item;

	const isUpdating = updateQuantityMutation.isPending;
	const isRemoving = removeItemMutation.isPending;
	const isBusy = isUpdating || isRemoving;

	const handleRemoveItem = () => {
		if (isBusy) return;
		removeItemMutation.mutate(product.id);
	};

	const handleIncreaseItemQuantity = () => {
		if (isBusy) return;
		updateQuantityMutation.mutate({
			productId: product.id,
			quantity: quantity + 1,
		});
	};

	const handleDecreaseItemQuantity = () => {
		if (isBusy) return;
		if (quantity <= 1) {
			handleRemoveItem();
			return;
		}
		updateQuantityMutation.mutate({
			productId: product.id,
			quantity: quantity - 1,
		});
	};

	return (
		<div
			aria-busy={isBusy}
			className={cn(
				"group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:border-brand-950/15 hover:shadow-sm transition-all",
				isRemoving && "opacity-50 scale-[0.99] pointer-events-none",
			)}
		>
			{/* Top / Left side: Image & Product Details */}
			<div className="flex items-center gap-3.5 min-w-0 w-full sm:flex-1">
				<Link
					to={APP_ROUTES.PRODUCT({ id: product.id })}
					className="size-16 sm:size-18 shrink-0 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center p-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-800/20"
				>
					<Image
						src={product.imageUrl}
						alt={product.name}
						objectFit="contain"
						className="h-full w-full object-center group-hover:scale-105 transition-transform duration-300"
					/>
				</Link>

				<div className="min-w-0 flex-1">
					<Link
						to={APP_ROUTES.PRODUCT({ id: product.id })}
						className="font-playfair text-sm sm:text-base font-bold text-slate-950 hover:text-brand-800 transition-colors line-clamp-1 block w-full"
					>
						{product.name}
					</Link>
					{product.category?.label && (
						<p className="text-[10px] sm:text-[11px] text-brand-800 font-bold uppercase tracking-wider mt-0.5 truncate">
							{product.category.label}
						</p>
					)}
					<p className="text-[11px] text-slate-400 mt-1">
						{formatPrice(product.price)} each
					</p>
				</div>
			</div>

			{/* Bottom / Right side: Quantity Selector, Total Price, & Delete Button */}
			<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
				<div className={cn("transition-opacity", isUpdating && "opacity-70")}>
					<QuantitySelector
						value={quantity}
						onDecrease={handleDecreaseItemQuantity}
						onIncrease={handleIncreaseItemQuantity}
						disabled={isBusy}
						isUpdating={isUpdating}
						size="sm"
					/>
				</div>

				<div className="flex items-center gap-3 sm:gap-5 ml-auto sm:ml-0">
					<div className="text-right min-w-16 sm:min-w-20">
						<p className="text-xs sm:text-base font-black text-slate-900">
							{formatPrice(product.price * quantity)}
						</p>
					</div>

					<button
						type="button"
						onClick={handleRemoveItem}
						disabled={isBusy}
						className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50 cursor-pointer disabled:cursor-not-allowed shrink-0"
						aria-label="Remove item from cart"
					>
						{isRemoving ? (
							<Loader2Icon className="size-4 animate-spin text-rose-500" />
						) : (
							<Trash2Icon className="size-4" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
};
