import {
	useRemoveFromCart,
	useUpdateCartItemQuantity,
} from "@/features/cart/services/mutations";
import type { PopulatedCartItem } from "../../schemas/cartSchema";
import { Link } from "react-router";
import { Loader2Icon, MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { formatCurrency } from "@/shared/utils/price";
import { APP_ROUTES } from "@/app/routes/paths";

export const ShoppingCartItem = ({ item }: { item: PopulatedCartItem }) => {
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
			className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-emerald-900/5 shadow-xs hover:border-emerald-900/10 transition-all ${
				isBusy ? "opacity-60 pointer-events-none" : "opacity-100"
			}`}
		>
			{/* Product Image & Details */}
			<div className="flex gap-4 items-center">
				<Link
					to={APP_ROUTES.PRODUCT(product.id)}
					className="size-20 shrink-0 bg-slate-50 rounded-xl border border-emerald-900/5 flex items-center justify-center p-2 hover:scale-102 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
				>
					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-full w-full object-contain"
						loading="lazy"
					/>
				</Link>

				<div>
					<Link
						to={APP_ROUTES.PRODUCT(product.id)}
						className="font-playfair text-lg font-bold text-slate-950 hover:text-emerald-800 transition-colors leading-tight block"
					>
						{product.name}
					</Link>
					{product.category?.label && (
						<p className="text-xs text-emerald-800 font-bold uppercase tracking-wider mt-1">
							{product.category.label}
						</p>
					)}
				</div>
			</div>

			{/* Controls (Quantity, Subtotal, Delete) */}
			<div className="flex items-center gap-6 sm:gap-8 justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
				{/* Quantity Selector */}
				<div className="flex items-center rounded-lg border border-emerald-900/15 bg-white p-0.5">
					<button
						type="button"
						onClick={handleDecreaseItemQuantity}
						disabled={isBusy}
						aria-label="Decrease quantity"
						className="size-7 font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-50 rounded-md cursor-pointer disabled:cursor-not-allowed"
					>
						<MinusIcon className="size-3" />
					</button>

					<span className="w-8 text-center text-xs font-bold text-slate-900 select-none flex items-center justify-center">
						{isUpdating ? (
							<Loader2Icon className="size-3 animate-spin text-emerald-800" />
						) : (
							quantity
						)}
					</span>

					<button
						type="button"
						onClick={handleIncreaseItemQuantity}
						disabled={isBusy}
						aria-label="Increase quantity"
						className="size-7 font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-50 rounded-md cursor-pointer disabled:cursor-not-allowed"
					>
						<PlusIcon className="size-3" />
					</button>
				</div>

				{/* Price Subtotal */}
				<div className="text-right min-w-17.5">
					<p className="text-sm font-black text-slate-900">
						{formatCurrency(product.price * quantity)}
					</p>
					<p className="text-[10px] text-slate-400 mt-0.5">
						{formatCurrency(product.price)} each
					</p>
				</div>

				{/* Delete button */}
				<button
					type="button"
					onClick={handleRemoveItem}
					disabled={isBusy}
					className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer disabled:cursor-not-allowed"
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
	);
};
