import { Controller, type UseFormReturn } from "react-hook-form";
import type { CheckoutFormValues } from "../../schemas/checkoutSchema";
import { useLanguage } from "@/shared/hooks/use-language";
import { Input } from "@/shared/components/ui/input";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { Loader2Icon, LockIcon } from "lucide-react";
import { formatCurrency } from "@/shared/utils/price";
import { useCheckout } from "../../services/mutations";
import { Checkbox } from "@/shared/components/ui/checkbox";

const StripeMark = () => (
	<svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
		<rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#635BFF" />
		<path
			d="M14.9 9.2c-.8-.3-1.6-.5-2.4-.5-1 0-1.5.4-1.5.9 0 .6.6.9 2 1.4 2.2.8 3.2 1.7 3.2 3.3 0 2-1.5 3.1-3.9 3.1-1.1 0-2.2-.2-3-.6v-2.1c.8.4 1.9.8 2.9.8 1 0 1.6-.4 1.6-1 0-.7-.6-1-2-1.5-2.1-.8-3.1-1.7-3.1-3.2 0-1.8 1.5-3 3.8-3 .9 0 1.8.1 2.5.4v2z"
			fill="#fff"
		/>
	</svg>
);

interface CheckoutFormProps {
	form: UseFormReturn<CheckoutFormValues>;
	totalToPay: number;
}

export const CheckoutForm = ({ form, totalToPay }: CheckoutFormProps) => {
	const { t } = useLanguage();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = form;

	const checkoutMutation = useCheckout();

	const handleCheckoutSubmit = (data: CheckoutFormValues) => {
		checkoutMutation.mutate(data);
	};

	return (
		<form
			onSubmit={handleSubmit(handleCheckoutSubmit)}
			className="space-y-6 w-full max-w-full"
		>
			{/* Step 1: Contact Information */}
			<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-7 shadow-xs transition-all hover:shadow-md">
				<h2 className="font-playfair text-lg sm:text-xl font-bold text-slate-950 mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3">
					<span className="size-6 bg-emerald-900 text-white rounded-full flex items-center justify-center text-xs font-bold font-sans shrink-0">
						1
					</span>
					{t("checkout.step1")}
				</h2>
				<div className="space-y-4">
					<div>
						<label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
							{t("checkout.phone")}
						</label>
						<div className="flex flex-col sm:flex-row gap-2 w-full">
							<div className="flex h-11 items-center justify-center sm:justify-start gap-2 rounded-xl border border-emerald-900/10 bg-slate-50 px-3.5 text-sm font-black text-slate-700 shrink-0">
								<span aria-hidden="true" className="text-base leading-none">
									🇲🇦
								</span>
								<span>+212</span>
							</div>
							<Input
								type="tel"
								placeholder="600 00 00 00"
								{...register("phone")}
								className="h-11 w-full min-w-0 rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 bg-[#fbfcf9] text-base sm:text-sm"
							/>
						</div>
						{errors.phone && (
							<p className="text-xs text-rose-600 mt-1.5 font-bold">
								{errors.phone.message}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Step 2: Shipping & Address */}
			<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-7 shadow-xs transition-all hover:shadow-md">
				<h2 className="font-playfair text-lg sm:text-xl font-bold text-slate-950 mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3">
					<span className="size-6 bg-emerald-900 text-white rounded-full flex items-center justify-center text-xs font-bold font-sans shrink-0">
						2
					</span>
					{t("checkout.step2")}
				</h2>
				<div className="space-y-4">
					<div>
						<label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
							{t("checkout.address")}
						</label>
						<Input
							type="text"
							placeholder="123 Wellness Way"
							{...register("street")}
							className="h-11 w-full min-w-0 rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 bg-[#fbfcf9] text-base sm:text-sm"
						/>
						{errors.street && (
							<p className="text-xs text-rose-600 mt-1.5 font-bold">
								{errors.street.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
						<div className="min-w-0">
							<label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
								{t("checkout.city")}
							</label>
							<Input
								type="text"
								placeholder="Casablanca"
								{...register("city")}
								className="h-11 w-full min-w-0 rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 bg-[#fbfcf9] text-base sm:text-sm"
							/>
							{errors.city && (
								<p className="text-xs text-rose-600 mt-1.5 font-bold">
									{errors.city.message}
								</p>
							)}
						</div>
						<div className="min-w-0">
							<label className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2">
								{t("checkout.country")}
							</label>
							<Input
								type="text"
								disabled
								{...register("country")}
								className="h-11 w-full min-w-0 rounded-xl border-emerald-900/10 focus-visible:ring-emerald-800 bg-slate-50 text-slate-500 cursor-not-allowed text-base sm:text-sm"
							/>
						</div>
					</div>

					{/* Fully Connected Checkbox */}
					<div className="pt-2">
						<Controller
							name="isDefault"
							control={control}
							render={({ field }) => (
								<div
									onClick={() => field.onChange(!field.value)}
									className={`flex items-start gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
										field.value
											? "border-emerald-800/40 bg-emerald-50/40 shadow-xs"
											: "border-emerald-900/10 bg-[#fbfcf9] hover:bg-emerald-50/20"
									}`}
								>
									<Checkbox
										id="isDefault"
										checked={field.value}
										onCheckedChange={field.onChange}
										className="mt-0.5 size-4 rounded border-emerald-900/20 data-[state=checked]:bg-emerald-900 data-[state=checked]:text-white data-[state=checked]:border-emerald-900 shrink-0"
									/>
									<div className="grid gap-0.5 select-none min-w-0">
										<label
											htmlFor="isDefault"
											className="text-sm font-bold text-slate-900 cursor-pointer leading-snug"
										>
											Set as default shipping address
										</label>
										<p className="text-xs text-slate-500 leading-relaxed">
											Save this address for your future orders and make it your
											primary shipping location.
										</p>
									</div>
								</div>
							)}
						/>
					</div>
				</div>
			</div>

			{/* Step 3: Payment */}
			<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-7 shadow-xs transition-all hover:shadow-md">
				<h2 className="font-playfair text-lg sm:text-xl font-bold text-slate-950 mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3">
					<span className="size-6 bg-emerald-900 text-white rounded-full flex items-center justify-center text-xs font-bold font-sans shrink-0">
						3
					</span>
					Stripe payment
				</h2>
				<div className="rounded-2xl border border-emerald-900/10 bg-[#f7fbf3] p-4 sm:p-5">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
						<div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-[#635BFF]/15 shadow-sm">
							<StripeMark />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-bold text-slate-950">
								Secure payment via Stripe
							</p>
							<p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-slate-500">
								You will be redirected to Stripe to complete your payment
								securely. No card details are stored on our servers.
							</p>
						</div>
					</div>
					<div className="mt-4 flex flex-wrap gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800">
						<span className="rounded-full border border-emerald-900/10 bg-white px-2.5 py-1 shadow-2xs">
							SSL protected
						</span>
						<span className="rounded-full border border-emerald-900/10 bg-white px-2.5 py-1 shadow-2xs">
							Stripe Checkout
						</span>
						<span className="rounded-full border border-emerald-900/10 bg-white px-2.5 py-1 shadow-2xs">
							Secure redirect
						</span>
					</div>
				</div>
			</div>

			{/* Submit Action */}
			<div className="grid gap-3 pt-2">
				<OriginButton
					type="submit"
					variant="emerald"
					disabled={checkoutMutation.isPending}
					className="w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/10 text-base"
				>
					{checkoutMutation.isPending ? (
						<>
							<Loader2Icon className="size-4 animate-spin" />
							<span>Redirecting...</span>
						</>
					) : (
						<>
							<LockIcon className="size-4 shrink-0" />
							<span className="truncate">
								Pay with Stripe &bull; {formatCurrency(totalToPay)}
							</span>
						</>
					)}
				</OriginButton>
			</div>
		</form>
	);
};
