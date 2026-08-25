import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import type { SystemError } from "@/shared/types";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";

interface PaymentVerificationErrorProps {
	error: SystemError;
	onRetry: () => void;
}
export const PaymentVerificationError = ({
	error,
	onRetry,
}: PaymentVerificationErrorProps) => {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#fcfdfa] p-4">
			<div className="flex flex-col items-center gap-4 rounded-3xl border border-rose-900/10 bg-white px-8 py-10 text-center shadow-xl shadow-rose-950/5 max-w-md w-full animate-fade-in">
				<div className="grid size-14 place-items-center rounded-full bg-rose-50 text-rose-700 shadow-inner">
					<AlertCircleIcon className="size-6" />
				</div>
				<div>
					<h1 className="text-2xl font-playfair font-normal text-slate-950">
						Payment Verification Failed
					</h1>
					<p className="mt-2 text-sm text-slate-500 leading-relaxed">
						{typeof error.detail === "string"
							? error.detail
							: error.description}
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4">
					<Button
						onClick={onRetry}
						variant="outline"
						className="flex-1 h-11 border-slate-200 hover:bg-slate-50 font-medium rounded-lg cursor-pointer"
					>
						Try Again
					</Button>
					<Button
						onClick={() => navigate(APP_ROUTES.SHOP)}
						className="flex-1 h-11 bg-slate-900 hover:bg-slate-950 text-white font-medium rounded-lg cursor-pointer shadow-sm"
					>
						Return to Shop
					</Button>
				</div>
			</div>
		</div>
	);
};
