import { APP_ROUTES } from "@/app/routes/paths";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { ShoppingBagIcon } from "lucide-react";
import { useNavigate } from "react-router";

export const EmptyCheckout = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-[#fcfdfa] flex flex-col items-center justify-center p-6 text-center">
			<div className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-500 shadow-inner mb-4">
				<ShoppingBagIcon className="size-7" />
			</div>
			<h2 className="font-playfair text-xl font-bold text-slate-900 mb-1">
				Your cart is empty
			</h2>
			<p className="text-sm text-slate-500 max-w-xs mb-6">
				Add items to your cart before proceeding to checkout.
			</p>
			<OriginButton
				onClick={() => navigate(APP_ROUTES.SHOP)}
				className="w-full max-w-xs h-11 rounded-lg font-bold"
			>
				Explore Shop
			</OriginButton>
		</div>
	);
};
