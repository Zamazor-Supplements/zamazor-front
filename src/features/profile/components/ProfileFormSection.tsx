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
import { APP_COUNTRY } from "@/app/config/constants";

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
			<div className="rounded-xl border border-brand-900/10 bg-card p-6 sm:p-8 shadow-xl shadow-brand-950/5 space-y-6">
				<div className="border-b border-brand-900/10 pb-5">
					<div className="flex items-center gap-3.5">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50">
							<UserIcon className="size-5" />
						</div>
						<div>
							<h2 className="font-playfair text-lg font-bold tracking-tight text-ink">
								Personal Information
							</h2>
							<p className="text-xs sm:text-sm text-ink-soft mt-0.5">
								Update your contact details and account information.
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-xs font-semibold text-ink block">
							Full Name
						</label>
						<Input
							type="text"
							disabled={isSaving}
							{...register("fullName")}
							className={`h-12 rounded-lg border bg-surface-2/50 text-sm px-4 transition-all focus-visible:bg-card focus-visible:ring-4 ${
								errors.fullName
									? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500/10"
									: "border-brand-900/10 focus-visible:border-brand-600 focus-visible:ring-brand-600/10"
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
							<label className="text-xs font-semibold text-ink block">
								Email Address
							</label>
							<span className="text-[10px] font-bold uppercase tracking-wider text-ink-faint bg-surface-2/80 px-2 py-0.5 rounded-md">
								Read-only
							</span>
						</div>
						<Input
							type="email"
							disabled
							value={userEmail}
							className="h-12 rounded-lg border border-brand-900/10 bg-surface-2/50 text-ink-soft cursor-not-allowed text-sm px-4"
						/>
					</div>
				</div>
			</div>

			{/* Primary Shipping Address Card */}
			<div className="rounded-xl border border-brand-900/10 bg-card p-6 sm:p-8 shadow-xl shadow-brand-950/5 space-y-6">
				<div className="border-b border-brand-900/10 pb-5">
					<div className="flex items-center gap-3.5">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700 shadow-sm border border-brand-100/50">
							<MapPin className="size-5" />
						</div>
						<div>
							<h2 className="font-playfair text-lg font-bold tracking-tight text-ink">
								Primary Shipping Address
							</h2>
							<p className="text-xs sm:text-sm text-ink-soft mt-0.5">
								This address will be automatically selected during your store
								checkout.
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<label className="text-xs font-semibold text-ink block">
							Street Address
						</label>
						<Input
							type="text"
							placeholder="123 Health Ave, Suite 400"
							disabled={isSaving}
							{...register("street")}
							className="h-12 rounded-lg border border-brand-900/10 bg-surface-2/50 text-sm px-4 transition-all focus-visible:bg-card focus-visible:border-brand-600 focus-visible:ring-4 focus-visible:ring-brand-600/10"
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-xs font-semibold text-ink block">
								City
							</label>
							<Input
								type="text"
								placeholder="Casablanca"
								disabled={isSaving}
								{...register("city")}
								className="h-12 rounded-lg border border-brand-900/10 bg-surface-2/50 text-sm px-4 transition-all focus-visible:bg-card focus-visible:border-brand-600 focus-visible:ring-4 focus-visible:ring-brand-600/10"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-xs font-semibold text-ink block">
								Country
							</label>
							<Input
								type="text"
								placeholder={APP_COUNTRY}
								disabled
								{...register("country")}
								className="h-12 rounded-lg border border-brand-900/10 bg-surface-2/50 text-sm px-4 transition-all focus-visible:bg-card focus-visible:border-brand-600 focus-visible:ring-4 focus-visible:ring-brand-600/10 cursor-not-allowed"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-semibold text-ink block">
							Phone Number
						</label>
						<div className="flex gap-2.5">
							<div className="flex h-12 items-center gap-2 rounded-lg border border-brand-900/10 bg-surface-2 px-4 text-xs font-bold text-ink shrink-0 shadow-sm">
								<span>🇲🇦</span>
								<span>+212</span>
							</div>
							<Input
								type="tel"
								placeholder="600-000000"
								disabled={isSaving}
								{...register("phone")}
								className="h-12 rounded-lg border border-brand-900/10 bg-surface-2/50 text-sm px-4 transition-all focus-visible:bg-card focus-visible:border-brand-600 focus-visible:ring-4 focus-visible:ring-brand-600/10"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Static Action Footer Card */}
			<div className="flex items-center justify-between rounded-xl border border-brand-900/10 bg-card p-6 sm:p-8 shadow-xl shadow-brand-950/5">
				<div className="text-xs text-ink-soft font-medium hidden sm:block">
					{isDirty ? (
						<span className="text-amber-700 font-semibold flex items-center gap-2">
							<span className="size-2 rounded-full bg-amber-500 animate-pulse" />
							You have unsaved changes.
						</span>
					) : (
						<span className="text-ink-faint">
							All changes are saved and synced.
						</span>
					)}
				</div>

				<OriginButton
					type="submit"
					disabled={isSaving || !isDirty}
					className="h-12 w-full sm:w-auto px-8 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-900/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
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
