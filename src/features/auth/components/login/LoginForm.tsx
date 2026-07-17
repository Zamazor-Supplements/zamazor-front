import { OriginButton } from "@/shared/components/ui/origin-button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	loginRequestSchema,
	type LoginRequest,
} from "../../schemas/loginSchema";
import { EmailField } from "@/shared/components/fields/EmailField";
import { PasswordField } from "@/shared/components/fields/PasswordField";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { APP_ROUTES } from "@/core/routes/paths";
import { useLanguage } from "@/shared/context/LanguageContext";
import { useLoginMutation } from "../../hooks/use-auth";

export const LoginForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { language } = useLanguage();
	const from = location.state?.from?.pathname || APP_ROUTES.HOME;
	const loginMutation = useLoginMutation();

	const onSubmit = async (data: LoginRequest) => {
		loginMutation.mutate(data, {
			onSuccess: (response) => {
				if (response.user.role === "ADMIN") {
					navigate(APP_ROUTES.DASHBOARD, { replace: true });
				} else {
					navigate(from, { replace: true });
				}
			},
		});
	};

	const {
		register,
		handleSubmit,
		clearErrors,
		formState: { errors, isSubmitting, isDirty },
	} = useForm({
		resolver: zodResolver(loginRequestSchema),
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
			<EmailField
				name="email"
				label={language === "fr" ? "Adresse e-mail" : "Email"}
				register={register}
				errors={errors}
			/>
			<PasswordField
				name="password"
				label={language === "fr" ? "Mot de passe" : "Password"}
				register={register}
				errors={errors}
			/>

			<OriginButton
				type="submit"
				variant="emerald"
				loading={isSubmitting}
				disabled={!isDirty}
				onClick={() => clearErrors("root")}
				className="w-full flex justify-center rounded-lg font-semibold"
			>
				{isSubmitting
					? language === "fr"
						? "Connexion en cours…"
						: "Signing in…"
					: language === "fr"
						? "Se connecter"
						: "Sign in"}
			</OriginButton>
		</form>
	);
};
