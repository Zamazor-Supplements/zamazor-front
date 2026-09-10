import { EmailField } from "@/shared/components/fields/EmailField";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "../../services/mutations";
import {
	requestPasswordResetSchema,
	type RequestPasswordResetInput,
} from "../../schemas/resetPasswordSchema";

export const ForgotPasswordForm = () => {
	const forgotPasswordMutation = useForgotPassword();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<RequestPasswordResetInput>({
		resolver: zodResolver(requestPasswordResetSchema),
	});

	const isLoading = isSubmitting || forgotPasswordMutation.isPending;

	const onSubmit = (data: RequestPasswordResetInput) => {
		forgotPasswordMutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
			<div className="space-y-4">
				<EmailField
					name="email"
					label="Email address"
					register={register}
					errors={errors}
					disabled={isLoading}
				/>
			</div>

			<OriginButton
				type="submit"
				loading={isLoading}
				disabled={!isDirty || isLoading}
				className="w-full justify-center rounded-lg py-3 text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
			>
				{isLoading ? "Sending link..." : "Send reset link"}
			</OriginButton>
		</form>
	);
};
