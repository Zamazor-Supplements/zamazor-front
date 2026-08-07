import { Link } from "react-router";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { APP_ROUTES } from "@/app/routes/paths";

import { useLanguage } from "@/shared/hooks/use-language";
import { ArrowLeftIcon } from "lucide-react";
import { useCart } from "@/features/cart/services/queries";
import CONFIG from "@/app/config/constants";
import { ShoppingCartItem } from "@/features/cart/components/cart/ShoppingCartItem";
import { EmptyCart } from "@/features/cart/components/cart/EmptyCart";
import { SummaryPanel } from "@/features/cart/components/cart/SummaryPanel";
import { Button } from "@/shared/components/ui/button";
import { CartErrorFallback } from "@/features/cart/components/feedback/CartErrorFallback";
import { CartPageSkeleton } from "@/features/cart/components/feedback/CartPageSkeleton";

export const CartPage = () => {
	const { t } = useLanguage();

	const { data: summary, isLoading, isFetching, isError, refetch } = useCart();

	useDocumentTitle(`${t("cart.title")} | ${CONFIG.APP_NAME}`);

	if (isLoading) return <CartPageSkeleton />;
	if (isError || !summary)
		return <CartErrorFallback onRetry={() => void refetch()} />;

	return (
		<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{/* Page Title */}
			<h1 className="text-3xl sm:text-4xl font-playfair font-normal text-slate-950 mb-8">
				{t("cart.title")}
			</h1>

			{summary.items.length === 0 ? (
				<EmptyCart />
			) : (
				<div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
					{/* Cart Items Column */}
					<div className="space-y-4">
						{summary.items.map((item) => (
							<ShoppingCartItem key={item.product.id} item={item} />
						))}

						{/* Back to Shop Action */}
						<div className="pt-4">
							<Button
								asChild
								variant="ghost"
								className="group inline-flex items-center gap-2 p-0 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:bg-transparent cursor-pointer"
							>
								<Link to={APP_ROUTES.SHOP}>
									<ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-1" />
									Continue shopping formulas
								</Link>
							</Button>
						</div>
					</div>

					{/* Checkout Summary Panel */}
					<SummaryPanel summary={summary} isFetching={isFetching} />
				</div>
			)}
		</main>
	);
};
