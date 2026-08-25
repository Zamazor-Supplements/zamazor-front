import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useLanguage } from "@/shared/hooks/use-language";
import { ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router";

export const EmptyCart = () => {
	const { t } = useLanguage();
	return (
		<div className="mx-auto max-w-xl py-12">
			<EmptyState
				icon={ShoppingBagIcon}
				title={t("cart.empty")}
				description={t("cart.emptyDesc")}
				action={
					<Button
						asChild
						className="h-11 rounded-lg bg-brand-900 px-6 text-white hover:bg-brand-950"
					>
						<Link to={APP_ROUTES.SHOP}>Browse formulas</Link>
					</Button>
				}
			/>
		</div>
	);
};
