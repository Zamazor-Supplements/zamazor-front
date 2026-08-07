import { Loader2Icon } from "lucide-react";

export const VerifyingPayment = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#fcfdfa] p-4">
			<div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-900/10 bg-white px-8 py-10 text-center shadow-xl shadow-emerald-950/5 max-w-md w-full animate-fade-in">
				<div className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-800 shadow-inner">
					<Loader2Icon className="size-6 animate-spin" />
				</div>
				<div>
					<h1 className="text-2xl font-playfair font-normal text-slate-950">
						Verifying payment
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						We are securely verifying your Stripe session and finalizing your
						order details.
					</p>
				</div>
			</div>
		</div>
	);
};
