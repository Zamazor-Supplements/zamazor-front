import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { LogOut, ShieldCheckIcon } from "lucide-react";
import type { User } from "@/features/auth/schemas/userSchema";
import { useLanguage } from "@/shared/hooks/use-language";

interface ProfileHeaderProps {
	user: Readonly<User>;
	onLogout: () => void;
	isLoggingOut: boolean;
}

export const ProfileHeader = ({
	user,
	onLogout,
	isLoggingOut,
}: ProfileHeaderProps) => {
	const { t } = useLanguage();

	const initials = useMemo(() => {
		return user.fullName
			.split(" ")
			.map((name) => name[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}, [user.fullName]);

	return (
		<div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs transition-all duration-200 hover:shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
			<div className="flex items-center gap-5 w-full sm:w-auto">
				{/* Avatar with subtle ring highlight */}
				<div className="relative shrink-0">
					<div className="size-16 sm:size-20 rounded-full bg-linear-to-br from-emerald-600 via-emerald-800 to-emerald-950 text-white font-bold text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-emerald-950/15 ring-4 ring-emerald-50">
						{initials}
					</div>
					<span
						className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 ring-2 ring-white"
						title="Online"
					/>
				</div>

				{/* User Info */}
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2.5">
						<h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
							{user.fullName}
						</h1>
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
							<ShieldCheckIcon className="size-3.5 text-emerald-600" />
							Active Account
						</span>
					</div>
					<p className="text-sm text-slate-500 mt-1 truncate">{user.email}</p>
				</div>
			</div>

			{/* Logout Action */}
			<Button
				type="button"
				onClick={onLogout}
				disabled={isLoggingOut}
				variant="outline"
				className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-200/80 bg-white text-slate-700 hover:bg-rose-50/80 hover:text-rose-600 hover:border-rose-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-2xs active:scale-98 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
			>
				<LogOut
					className={`size-4 transition-transform ${isLoggingOut ? "animate-pulse" : "group-hover:-translate-x-0.5"}`}
				/>
				<span>{isLoggingOut ? "Logging out..." : t("nav.logout")}</span>
			</Button>
		</div>
	);
};
