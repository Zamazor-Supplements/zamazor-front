import { ArrowLeftIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthTopActionLink {
	to: string;
	Icon?: LucideIcon;
	children: ReactNode;
}

export const AuthTopActionLink = ({
	to,
	Icon = ArrowLeftIcon,
	children,
}: AuthTopActionLink) => {
	return (
		<div className="flex md:absolute md:top-6 md:right-6 mb-4 md:mb-0 z-20 justify-start md:justify-end">
			<Link
				to={to}
				className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-brand-800 dark:text-lime-300 border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
			>
				<Icon className="h-3.5 w-3.5" />
				{children}
			</Link>
		</div>
	);
};
