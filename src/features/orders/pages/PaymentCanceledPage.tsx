import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import {
	ArrowLeftIcon,
	HelpCircleIcon,
	ShoppingBagIcon,
	XCircleIcon,
} from "lucide-react";
import { Link, useParams } from "react-router";

export default function PaymentCanceledPage() {
	const { orderId } = useParams();

	useDocumentTitle(`Payment Canceled | ${CONFIG.APP_NAME}`);

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fcfdfa] px-4 py-12 selection:bg-amber-100">
			{/* Background Decorative Glow */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-40">
				<div className="size-125 rounded-full bg-amber-100/50 blur-3xl" />
			</div>

			<div className="relative w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-900/3 backdrop-blur-xl sm:p-10">
				{/* Top Badge Indicator */}
				<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-800 border border-amber-200/60">
					<span className="size-2 rounded-full bg-amber-500 animate-pulse" />
					Checkout Interrupted
				</div>

				{/* Main Header & Icon */}
				<div className="flex items-start gap-4">
					<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100/60 text-amber-700">
						<XCircleIcon className="size-7" />
					</div>
					<div>
						<h1 className="font-playfair text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
							Payment was canceled
						</h1>
						<p className="mt-1.5 text-sm leading-relaxed text-slate-500">
							No worries—your order hasn't gone through and{"  "}
							<strong className="font-medium text-slate-700">
								no charges were made
							</strong>{" "}
							to your account.
						</p>
					</div>
				</div>

				{/* Order Reference Snippet (if available) */}
				{orderId && (
					<div className="mt-6 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
						<span>Reference Order</span>
						<span className="font-mono font-semibold text-slate-800">
							#{orderId.slice(0, 12).toUpperCase()}
						</span>
					</div>
				)}

				{/* Action Buttons */}
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<Button
						asChild
						className="flex-1 rounded-md bg-slate-900 px-6 py-5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all"
					>
						<Link
							to={APP_ROUTES.CART}
							className="flex items-center justify-center gap-2"
						>
							<ArrowLeftIcon className="size-4" />
							Return to Cart
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						className="flex-1 rounded-md border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
					>
						<Link
							to={APP_ROUTES.SHOP}
							className="flex items-center justify-center gap-2"
						>
							<ShoppingBagIcon className="size-4" />
							Continue Shopping
						</Link>
					</Button>
				</div>

				{/* Footer Help Link */}
				<div className="mt-8 border-t border-slate-100 pt-6 text-center">
					<p className="text-xs text-slate-400">
						Experiencing issues with checkout?{" "}
						<Link
							to={APP_ROUTES.PAGES.HELP}
							className="inline-flex items-center gap-1 font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
						>
							<HelpCircleIcon className="size-3" />
							Contact Support
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
