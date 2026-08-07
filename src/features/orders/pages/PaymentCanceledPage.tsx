import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router";

export const PaymentCanceledPage = () => {
	const { orderId } = useParams();

	useDocumentTitle(`Payment Canceled | ${CONFIG.APP_NAME}`);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfdfa] p-4 text-center">
			<ShieldCheck className="mb-4 size-16 text-amber-700/30" />
			<h1 className="text-3xl font-playfair text-slate-900">
				Payment canceled
			</h1>
			<p className="mt-2 max-w-md text-slate-500">
				Your Stripe payment was canceled
				{orderId ? ` for order ${orderId.slice(0, 8).toUpperCase()}` : ""}
			</p>
			<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
				<Button
					asChild
					className="rounded-xl bg-emerald-900 px-6 text-white hover:bg-emerald-950"
				>
					<Link to={APP_ROUTES.CHECKOUT.ROOT}>Return to checkout</Link>
				</Button>
				<Button
					asChild
					variant="outline"
					className="rounded-xl border-emerald-900/10 px-6 text-emerald-900 hover:bg-emerald-50"
				>
					<Link to={APP_ROUTES.SHOP}>Back to shop</Link>
				</Button>
			</div>
		</div>
	);
};
