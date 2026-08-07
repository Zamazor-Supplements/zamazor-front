import { Input } from "@/shared/components/ui/input";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { Loader2, MapPin, Save, User as UserIcon } from "lucide-react";
import type {
	FieldErrorsImpl,
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";
import type { ProfileFormValues } from "@/features/auth/schemas/profileSchema";

interface ProfileFormSectionProps {
	userFullName: string;
	userEmail: string;
	register: UseFormRegister<ProfileFormValues>;
	errors: FieldErrorsImpl<ProfileFormValues>;
	handleSubmit: UseFormHandleSubmit<ProfileFormValues>;
	onSubmit: SubmitHandler<ProfileFormValues>;
	isSaving: boolean;
	isDirty: boolean;
}

export const ProfileFormSection = ({
	userEmail,
	register,
	errors,
	handleSubmit,
	onSubmit,
	isSaving,
	isDirty,
}: ProfileFormSectionProps) => {
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* Personal Information Card */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
				<div className="border-b border-slate-100 pb-5">
					<div className="flex items-center gap-3.5">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50">
							<UserIcon className="size-5" />
						</div>
						<div>
							<h2 className="font-playfair text-lg font-bold tracking-tight text-slate-900">
								Personal Information
							</h2>
							<p className="text-xs sm:text-sm text-slate-500 mt-0.5">
								Update your contact details and account information.
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-xs font-semibold text-slate-700 block">
							Full Name
						</label>
						<Input
							type="text"
							disabled={isSaving}
							{...register("fullName")}
							className={`h-12 rounded-2xl border bg-slate-50/50 text-sm px-4 transition-all focus-visible:bg-white focus-visible:ring-4 ${
								errors.fullName
									? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500/10"
									: "border-slate-200 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/10"
							}`}
						/>
						{errors.fullName && (
							<p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1.5">
								<span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
								{errors.fullName.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-xs font-semibold text-slate-700 block">
								Email Address
							</label>
							<span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md">
								Read-only
							</span>
						</div>
						<Input
							type="email"
							disabled
							value={userEmail}
							className="h-12 rounded-2xl border border-slate-200 bg-slate-100/50 text-slate-500 cursor-not-allowed text-sm px-4"
						/>
					</div>
				</div>
			</div>

			{/* Primary Shipping Address Card */}
			<div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
				<div className="border-b border-slate-100 pb-5">
					<div className="flex items-center gap-3.5">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50">
							<MapPin className="size-5" />
						</div>
						<div>
							<h2 className="font-playfair text-lg font-bold tracking-tight text-slate-900">
								Primary Shipping Address
							</h2>
							<p className="text-xs sm:text-sm text-slate-500 mt-0.5">
								This address will be automatically selected during your store
								checkout.
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<label className="text-xs font-semibold text-slate-700 block">
							Street Address
						</label>
						<Input
							type="text"
							placeholder="123 Health Ave, Suite 400"
							disabled={isSaving}
							{...register("street")}
							className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm px-4 transition-all focus-visible:bg-white focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-xs font-semibold text-slate-700 block">
								City
							</label>
							<Input
								type="text"
								placeholder="Casablanca"
								disabled={isSaving}
								{...register("city")}
								className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm px-4 transition-all focus-visible:bg-white focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-xs font-semibold text-slate-700 block">
								Country
							</label>
							<Input
								type="text"
								placeholder="Morocco"
								disabled={isSaving}
								{...register("country")}
								className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm px-4 transition-all focus-visible:bg-white focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-semibold text-slate-700 block">
							Phone Number
						</label>
						<div className="flex gap-2.5">
							<div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 shrink-0 shadow-sm">
								<span>🇲🇦</span>
								<span>+212</span>
							</div>
							<Input
								type="tel"
								placeholder="600-000000"
								disabled={isSaving}
								{...register("phone")}
								className="h-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm px-4 transition-all focus-visible:bg-white focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Static Action Footer Card */}
			<div className="flex items-center justify-between rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5">
				<div className="text-xs text-slate-500 font-medium hidden sm:block">
					{isDirty ? (
						<span className="text-amber-700 font-semibold flex items-center gap-2">
							<span className="size-2 rounded-full bg-amber-500 animate-pulse" />
							You have unsaved changes.
						</span>
					) : (
						<span className="text-slate-400">
							All changes are saved and synced.
						</span>
					)}
				</div>

				<OriginButton
					variant="emerald"
					type="submit"
					disabled={isSaving || !isDirty}
					className="h-12 w-full sm:w-auto px-8 rounded-2xl font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
				>
					{isSaving ? (
						<>
							<Loader2 className="size-4 animate-spin text-white" />
							<span>Saving changes...</span>
						</>
					) : (
						<>
							<Save className="size-4" />
							<span>Save Changes</span>
						</>
					)}
				</OriginButton>
			</div>
		</form>
	);
};
