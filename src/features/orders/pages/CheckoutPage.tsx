import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	checkoutSchema,
	type CheckoutFormValues,
} from "@/features/orders/schemas/checkoutSchema";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { useAuthenticatedUser } from "@/features/auth/services/queries";
import { useLanguage } from "@/shared/hooks/use-language";
import { LockIcon } from "lucide-react";
import { useCart } from "@/features/cart/services/queries";
import CONFIG from "@/app/config/constants";
import { CheckoutForm } from "@/features/orders/components/checkout/CheckoutForm";
import { EmptyCheckout } from "@/features/orders/components/empty/EmptyCheckout";
import { CheckoutHeader } from "@/features/orders/components/checkout/CheckoutHeader";
import { OrderReview } from "@/features/orders/components/checkout/OrderReview";
import { CheckoutSkeleton } from "../components/feedback/CheckoutSkeleton";

export const CheckoutPage = () => {
	const { t } = useLanguage();
	const { data: cartSummary, isPending } = useCart();
	const user = useAuthenticatedUser();

	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			street: user.address?.street ?? "",
			city: user.address?.city ?? "",
			phone: user.address?.phone ?? "",
			country: user.address?.country ?? "Morocco",
			isDefault: false,
		},
	});

	useDocumentTitle(`${t("checkout.title")} | ${CONFIG.APP_NAME}`);

	if (isPending) {
		return <CheckoutSkeleton />;
	}

	if (!cartSummary || cartSummary.items.length === 0) return <EmptyCheckout />;

	return (
		<div className="min-h-screen bg-[#fcfdfa] text-slate-900 selection:bg-emerald-100 flex flex-col justify-between overflow-x-hidden">
			<div>
				<div className="bg-emerald-950 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-emerald-50 flex items-center justify-center gap-2 relative z-50">
					<LockIcon className="size-3.5 text-lime-300 shrink-0" />
					<span className="truncate">
						Secure SSL 256-bit checkout &bull; {CONFIG.APP_NAME} Inc.
					</span>
				</div>
				<CheckoutHeader />

				{/* Added overflow-hidden and adjusted grid constraints to prevent blowout */}
				<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-8 items-start">
						<div className="w-full min-w-0">
							<CheckoutForm form={form} totalToPay={cartSummary.total} />
						</div>
						<div className="w-full min-w-0">
							<OrderReview cartSummary={cartSummary} />
						</div>
					</div>
				</main>
			</div>

			<footer className="text-center py-8 text-xs text-slate-400 border-t border-emerald-900/5 mt-12 bg-white font-sans px-4">
				<p>
					&copy; {new Date().getFullYear()} {CONFIG.APP_NAME} Clean Supplements.
					All rights reserved. Secure 256-bit encryption connection.
				</p>
			</footer>
		</div>
	);
};
