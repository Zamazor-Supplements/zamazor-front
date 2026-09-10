import CONFIG from "@/app/config/constants";
import { RegisterForm } from "@/features/auth/components/register/RegisterForm";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { APP_ROUTES } from "@/app/routes/paths";
import heroGreens from "@/assets/images/hero_greens.png";
import logo from "@/assets/images/zamazor.svg";
import { AuthRedirectPrompt } from "../components/shared/AuthRedirectPrompt";
import { AuthTopActionLink } from "../components/shared/AuthTopActionLink";

export default function RegisterPage() {
	useDocumentTitle(`Register | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950 p-0 md:p-4">
			<div className="w-full h-screen md:h-auto relative max-w-6xl overflow-hidden flex flex-col md:flex-row md:shadow-2xl md:rounded-3xl bg-white dark:bg-gray-900 border-0 md:border md:border-gray-100 md:dark:border-gray-800">
				{/* Background decorative elements */}
				<div className="w-60 h-60 bg-lime-400/20 absolute z-1 rounded-full -bottom-16 -left-16 blur-2xl pointer-events-none"></div>
				<div className="w-32 h-20 bg-brand-500/10 absolute z-1 rounded-full -top-10 -right-10 blur-xl pointer-events-none"></div>

				{/* Left Side: Premium Supplement Showcase Card */}
				<div
					className="hidden md:flex relative bg-brand-950 text-white p-12 w-1/2 flex-col justify-end overflow-hidden"
					style={{
						backgroundImage: `url(${heroGreens})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					{/* Adjusted opacity overlay to let image colors shine through */}
					<div className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/40 to-transparent z-0"></div>

					<div className="relative z-10 flex flex-col justify-end h-full">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-300 text-brand-950 text-xs font-semibold tracking-wide w-fit mb-4 uppercase">
							Pure & Traceable Ingredients
						</div>
						<h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-white mb-3 font-playfair">
							Fuel your peak performance.
						</h1>
						<p className="text-sm text-gray-200/90 leading-relaxed max-w-md">
							Experience the purity of science-backed, premium organic
							supplements made to support your daily wellness journey.
						</p>
					</div>
				</div>

				{/* Right Side: Register Form */}
				<div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-white dark:bg-gray-900 z-10 text-gray-900 dark:text-gray-100 justify-center overflow-y-auto max-h-screen md:max-h-[90vh] relative">
					{/* Go to Store Button */}
					<AuthTopActionLink to={APP_ROUTES.HOME}>
						Go to Store
					</AuthTopActionLink>

					<div className="flex flex-col items-center text-center mb-6 mt-2 md:mt-0">
						<img
							src={logo}
							alt={`${CONFIG.APP_NAME} Logo`}
							className="h-10 mb-4 object-contain rounded-lg"
						/>
						<h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">
							{`Join ${CONFIG.APP_NAME}`}
						</h2>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Start your path to peak wellness today.
						</p>
					</div>

					<div className="w-full">
						<RegisterForm />
					</div>

					<AuthRedirectPrompt
						message="Already have an account?"
						linkText="Login"
						to={APP_ROUTES.AUTH.LOGIN}
					/>
				</div>
			</div>
		</div>
	);
}
