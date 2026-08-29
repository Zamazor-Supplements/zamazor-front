import { PasswordField } from "@/shared/components/fields/PasswordField";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useResetPassword } from "../../services/mutations";
import {
	resetPasswordFormSchema,
	type ResetPasswordFormInput,
} from "../../schemas/resetPasswordSchema";

export const ResetPasswordForm = ({ token }: { token: string }) => {
	const resetPasswordMutation = useResetPassword();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<ResetPasswordFormInput>({
		resolver: zodResolver(resetPasswordFormSchema),
	});

	const isLoading = isSubmitting || resetPasswordMutation.isPending;

	const onSubmit = (data: ResetPasswordFormInput) => {
		resetPasswordMutation.mutate({ newPassword: data.newPassword, token });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
			<div className="space-y-4">
				<div className="space-y-1.5">
					<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
						New Password
					</span>
					<PasswordField
						name="newPassword"
						autoComplete="new-password"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
				</div>

				<div className="space-y-1.5">
					<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
						Confirm New Password
					</span>
					<PasswordField
						name="confirmPassword"
						autoComplete="new-password"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
				</div>
			</div>

			<OriginButton
				type="submit"
				loading={isLoading}
				disabled={!isDirty || isLoading}
				className="w-full justify-center rounded-lg py-3 text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
			>
				{isLoading ? "Updating password..." : "Reset password"}
			</OriginButton>
		</form>
	);
};
