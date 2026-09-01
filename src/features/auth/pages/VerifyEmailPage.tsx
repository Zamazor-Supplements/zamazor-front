import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { useVerifyEmail } from "../services/mutations";
import { APP_ROUTES } from "@/app/routes/paths";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import logo from "@/assets/images/zamazor.svg";
import { CheckCircle2Icon, XCircleIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function VerifyEmailPage() {
	useDocumentTitle(`Verify Email | ${CONFIG.APP_NAME}`);
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const { mutateAsync: verifyEmail } = useVerifyEmail();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		token ? "loading" : "error",
	);
	const [errorMessage, setErrorMessage] = useState(
		token ? "" : "No verification token found.",
	);
	const hasAttempted = useRef(false);

	useEffect(() => {
		if (!token) return;

		if (hasAttempted.current) return;
		hasAttempted.current = true;

		verifyEmail({ token })
			.then(() => setStatus("success"))
			.catch((err) => {
				setStatus("error");
				setErrorMessage(
					err.message ||
						"Failed to verify email. The link may have expired or is invalid.",
				);
			});
	}, [token, verifyEmail]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
			<div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
				<img
					src={logo}
					alt={CONFIG.APP_NAME}
					className="h-10 mb-8 object-contain"
				/>

				{status === "loading" && (
					<div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
						<Loader2Icon className="w-16 h-16 text-brand-500 animate-spin mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Verifying your email...
						</h2>
						<p className="text-gray-500 dark:text-gray-400">
							Please wait while we confirm your email address.
						</p>
					</div>
				)}

				{status === "success" && (
					<div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
						<CheckCircle2Icon className="w-16 h-16 text-green-500 mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Email Verified!
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							Your email address has been successfully verified. You can now
							access all features.
						</p>
						<Button asChild className="w-full h-full py-3">
							<Link to={APP_ROUTES.HOME}>Continue to Dashboard</Link>
						</Button>
					</div>
				)}

				{status === "error" && (
					<div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
						<XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
							Verification Failed
						</h2>
						<p className="text-gray-500 dark:text-gray-400 mb-8">
							{errorMessage}
						</p>
						<div className="flex flex-col gap-3 w-full">
							<Button variant="default" asChild className="w-full h-full py-3">
								<Link to={APP_ROUTES.USER.PROFILE}>
									Go to Profile to Resend
								</Link>
							</Button>
							<Button variant="outline" asChild className="w-full h-10">
								<Link to={APP_ROUTES.HOME}>Back to Home</Link>
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
