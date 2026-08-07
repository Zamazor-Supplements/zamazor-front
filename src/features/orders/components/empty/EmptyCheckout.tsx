import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router";

export const EmptyCheckout = () => {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfdfa] p-4 text-center">
			<ShoppingBagIcon className="size-16 text-emerald-900/25 mb-4" />
			<h1 className="text-3xl font-playfair text-slate-900">
				Your checkout is empty
			</h1>
			<p className="mt-2 text-slate-500">
				There are no items in your cart to checkout.
			</p>
			<Button
				asChild
				className="mt-6 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl"
			>
				<Link to={APP_ROUTES.SHOP}>Browse formulas</Link>
			</Button>
		</div>
	);
};
