import { useCartCount } from "@/features/cart/services/queries";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { OriginButton } from "../../../../shared/components/ui/origin-button";
import { APP_ROUTES } from "@/app/routes/paths";
import { cn } from "@/lib/utils";
import { ShoppingBagIcon } from "lucide-react";

export const BouncingCart = () => {
	const count = useCartCount();
	const navigate = useNavigate();

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
			variant="emerald"
			aria-label="Cart"
			onClick={() => navigate(APP_ROUTES.CART)}
			className={cn(
				"h-9 w-9 p-0 rounded-full flex items-center justify-center relative cursor-pointer transition-all duration-300",
				isCartBouncing
					? "scale-115 bg-lime-300 text-emerald-950 shadow-md animate-bounce"
					: "",
			)}
		>
			<ShoppingBagIcon className="size-4.5" />
			{count > 0 && (
				<span
					className={cn(
						"absolute -top-1 -right-1 bg-lime-300 text-emerald-950 font-sans font-black text-[9px] size-4.5 rounded-full flex items-center justify-center shadow-xs transition-transform duration-300",
						isCartBouncing ? "scale-110 bg-emerald-950 text-white" : "",
					)}
				>
					{count}
				</span>
			)}
		</OriginButton>
	);
};
