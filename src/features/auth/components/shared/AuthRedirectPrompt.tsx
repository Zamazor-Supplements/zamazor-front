import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router";

interface AuthRedirectPromptProps {
	message: string;
	linkText: string;
	to: string;
	className?: string;
}

export const AuthRedirectPrompt = ({
	message,
	linkText,
	to,
	className,
}: AuthRedirectPromptProps) => {
	const location = useLocation();
	const from = location.state?.from;

	return (
		<div className="mt-6 text-center">
			<p
				className={cn(
					"mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400",
					className,
				)}
			>
				{message}
				<Link
					to={to}
					state={{ from }}
					className="ms-1 font-semibold text-brand-700 hover:text-brand-800 dark:text-lime-400 dark:hover:text-lime-300 hover:underline"
				>
					{linkText}
				</Link>
			</p>
		</div>
	);
};
