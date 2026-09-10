import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	registerRequestSchema,
	type RegisterRequest,
} from "../../schemas/registerSchema";
import { PasswordField } from "@/shared/components/fields/PasswordField";
import { EmailField } from "@/shared/components/fields/EmailField";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { notify } from "@/lib/notify";
import { NameField } from "@/shared/components/fields/NameField";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { useRegister } from "../../services/mutations";

export const RegisterForm = () => {
	const registerMutation = useRegister();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<RegisterRequest>({
		resolver: zodResolver(registerRequestSchema),
	});

	const isLoading = isSubmitting || registerMutation.isPending;

	const onSubmit = (data: RegisterRequest) => {
		registerMutation.mutate(data);
	};

	const onError = () => {
		notify.error("Validation Error", {
			description: "Please fix the highlighted fields below.",
			requiresInternet: false,
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit, onError)}
			noValidate
			className="space-y-5 w-full max-w-full"
		>
			{/* Form Fields */}
			<div className="space-y-4">
				<div className="min-w-0">
					<NameField
						label="Full Name"
						name="fullName"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
				</div>

				<div className="min-w-0">
					<EmailField
						label="Email address"
						name="email"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
				</div>

				<div className="min-w-0">
					<PasswordField
						label="Password"
						name="password"
						autoComplete="new-password"
						register={register}
						errors={errors}
						disabled={isLoading}
					/>
				</div>
			</div>

			{/* Submit Button */}
			<div className="pt-1">
				<OriginButton
					type="submit"
					loading={isLoading}
					disabled={!isDirty || isLoading}
					className="w-full h-12 justify-center rounded-lg text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{isLoading ? "Creating account..." : "Create account"}
				</OriginButton>
			</div>

			{/* Terms & Privacy Legal Footer */}
			<div className="pt-2">
				<p className="text-center text-xs text-slate-500 leading-relaxed">
					By registering, you agree to our{" "}
					<Link
						to={APP_ROUTES.PAGES.TERMS}
						className="font-medium text-brand-800 hover:text-brand-950 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-brand-800/20 rounded-xs"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						to={APP_ROUTES.PAGES.PRIVACY}
						className="font-medium text-brand-800 hover:text-brand-950 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-brand-800/20 rounded-xs"
					>
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</form>
	);
};
