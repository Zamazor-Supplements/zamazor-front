import { OriginButton } from "@/shared/components/ui/origin-button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	loginRequestSchema,
	type LoginRequest,
} from "../../schemas/loginSchema";
import { EmailField } from "@/shared/components/fields/EmailField";
import { PasswordField } from "@/shared/components/fields/PasswordField";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { useLogin } from "../../services/mutations";

export const LoginForm = () => {
	const loginMutation = useLogin();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<LoginRequest>({
		resolver: zodResolver(loginRequestSchema),
	});

	const isLoading = isSubmitting || loginMutation.isPending;

	const onSubmit = (data: LoginRequest) => {
		loginMutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
			{/* Form Fields */}
			<div className="space-y-4">
				<EmailField
					name="email"
					label="Email address"
					register={register}
					errors={errors}
					disabled={isLoading}
				/>

				<div className="space-y-1.5">
					{/* Header Row: Label + Password Reset Link */}
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold text-slate-700">
							Password
						</span>
						<Link
							to={APP_ROUTES.AUTH.FORGOT_PASSWORD}
							className="text-xs font-medium text-brand-800 hover:text-brand-950 hover:underline transition-colors"
						>
							Forgot password?
						</Link>
					</div>

					<PasswordField
						name="password"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
				</div>
			</div>

			{/* Submit Button */}
			<OriginButton
				type="submit"
				loading={isLoading}
				disabled={!isDirty || isLoading}
				className="w-full justify-center rounded-lg py-3 text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
			>
				{isLoading ? "Signing in..." : "Sign in"}
			</OriginButton>
		</form>
	);
};
