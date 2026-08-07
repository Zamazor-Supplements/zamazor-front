import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { useLanguage } from "@/shared/hooks/use-language";
import { ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router";

export const EmptyCart = () => {
	const { t } = useLanguage();
	return (
		<div className="text-center py-20 bg-white rounded-3xl border border-emerald-900/5 shadow-xs max-w-xl mx-auto px-6">
			<ShoppingBagIcon className="size-16 text-emerald-900/25 mx-auto mb-4" />
			<h2 className="text-2xl font-playfair text-slate-900">
				{t("cart.empty")}
			</h2>
			<p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
				{t("cart.emptyDesc")}
			</p>
			<Button
				asChild
				className="mt-8 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl h-11 px-6"
			>
				<Link to={APP_ROUTES.SHOP}>Browse formulas</Link>
			</Button>
		</div>
	);
};
