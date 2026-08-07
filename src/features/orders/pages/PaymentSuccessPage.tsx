import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
// import { useAuthenticatedUser } from "@/features/auth/stores/authStore";
import { useAuthenticatedUser } from "@/features/auth/services/queries";
import { useVerifyOrderPayment } from "../services/queries";
import { Button } from "@/shared/components/ui/button";
import { useLanguage } from "@/shared/hooks/use-language";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { formatCurrency } from "@/shared/utils/price";
import { CheckCircle2Icon, SparklesIcon } from "lucide-react";
import {
	Navigate,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router";
import { VerifyingPayment } from "../components/feedback/VerifyingPayment";
import { PaymentVerificationError } from "../components/feedback/PaymentVerificationError";

export const PaymentSuccessPage = () => {
	const { orderId } = useParams();
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("sessionId") ?? undefined;
	const navigate = useNavigate();
	const { t } = useLanguage();
	const user = useAuthenticatedUser();

	const { isPending, isError, error, data, refetch } = useVerifyOrderPayment({
		orderId,
		sessionId,
	});

	useDocumentTitle(
		`${isPending ? "Verifying Payment..." : "Payment Succeeded"} | ${CONFIG.APP_NAME}`,
	);

	if (!orderId || !sessionId) return <Navigate to={APP_ROUTES.SHOP} replace />;

	if (isPending) return <VerifyingPayment />;
	if (isError)
		return <PaymentVerificationError error={error} onRetry={() => refetch()} />;

	return (
		<div className="min-h-screen bg-[#fcfdfa] flex flex-col items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-3xl border border-emerald-900/10 p-6 sm:p-8 text-center shadow-xl shadow-emerald-950/5 animate-fade-in">
				<div className="grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 mx-auto mb-5 shadow-inner">
					<CheckCircle2Icon className="size-8" />
				</div>

				<h1 className="text-3xl font-playfair font-normal text-slate-950">
					{t("checkout.successTitle")}
				</h1>
				<p className="text-sm text-slate-500 mt-2 leading-relaxed">
					Your clean stack order has been successfully placed. We've sent
					receipt details and updates to{" "}
					<strong className="text-slate-800 font-medium">{user.email}</strong>.
				</p>

				<div className="my-6 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-900/5 text-left text-sm space-y-2.5">
					<div className="flex justify-between items-center">
						<span className="text-slate-500">{t("checkout.orderNumber")}:</span>
						<span className="font-mono font-semibold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-emerald-900/5 shadow-2xs">
							{orderId?.slice(0, 8).toUpperCase()}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-slate-500">{t("checkout.delivery")}:</span>
						<span className="font-medium text-slate-900">
							{t("checkout.standardShipping")}
						</span>
					</div>
					<div className="flex justify-between items-center pt-1 border-t border-emerald-950/5">
						<span className="text-slate-500 font-medium">Order Total:</span>
						<span className="font-bold text-emerald-900 text-base">
							{formatCurrency(data?.total ?? 0)}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-semibold tracking-wider uppercase mb-6 bg-emerald-50/60 py-2 rounded-xl">
					<SparklesIcon className="size-4 text-emerald-700" />
					<span>Consistency starts now</span>
				</div>

				<Button
					onClick={() => navigate(APP_ROUTES.SHOP)}
					className="w-full h-12 bg-emerald-900 hover:bg-emerald-950 text-white font-medium rounded-xl cursor-pointer shadow-md transition-all duration-200 active:scale-[0.98]"
				>
					{t("checkout.returnHome")}
				</Button>
			</div>
		</div>
	);
};
