import { useCartCount } from "@/features/cart/services/queries";
import { useCartDrawerStore } from "@/features/cart/stores/cartDrawerStore";
import { useEffect, useRef, useState } from "react";
import { OriginButton } from "../../../../shared/components/ui/origin-button";
import { cn } from "@/lib/utils";
import { ShoppingBagIcon } from "lucide-react";

export const BouncingCart = () => {
	const count = useCartCount();
	const openCartDrawer = useCartDrawerStore((s) => s.open);

	const [isCartBouncing, setIsCartBouncing] = useState(false);
	const prevCountRef = useRef(count);

	useEffect(() => {
		const prevCount = prevCountRef.current;
		prevCountRef.current = count;

		if (count > prevCount) {
			setIsCartBouncing(true);
			const timer = setTimeout(() => setIsCartBouncing(false), 500);
			return () => clearTimeout(timer);
		}
	}, [count]);

	return (
		<OriginButton
			aria-label="Cart"
			onClick={openCartDrawer}
			className={cn(
				"h-9 w-9 p-0 rounded-full flex items-center justify-center relative cursor-pointer transition-all duration-300",
				isCartBouncing
					? "scale-115 bg-lime-300 text-brand-950 shadow-md animate-bounce"
					: "",
			)}
		>
			<ShoppingBagIcon className="size-4.5" />
			{count > 0 && (
				<span
					className={cn(
						"absolute -top-1 -right-1 bg-lime-300 text-brand-950 font-sans font-black text-[9px] size-4.5 rounded-full flex items-center justify-center shadow-xs transition-transform duration-300",
						isCartBouncing ? "scale-110 bg-brand-950 text-white" : "",
					)}
				>
					{count}
				</span>
			)}
		</OriginButton>
	);
};
