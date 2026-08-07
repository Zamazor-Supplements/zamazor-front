import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
	language: "en" | "fr";
	onLanguageChange: (lang: "en" | "fr") => void;
}

export const HeaderLanguageSwitcher = ({
	language,
	onLanguageChange,
}: LanguageSwitcherProps) => {
	return (
		<div className="mr-1 flex items-center gap-1 rounded-full border border-emerald-950/10 bg-emerald-50/50 p-0.5">
			{(["en", "fr"] as const).map((lang) => (
				<button
					key={lang}
					type="button"
					onClick={() => onLanguageChange(lang)}
					aria-label={
						lang === "en" ? "Switch to English" : "Changer en Français"
					}
					className={cn(
						"h-6 cursor-pointer rounded-full px-2 text-[10px] font-bold transition-all uppercase",
						language === lang
							? "bg-emerald-900 text-white shadow-xs"
							: "text-emerald-800 hover:bg-emerald-50/30",
					)}
				>
					{lang}
				</button>
			))}
		</div>
	);
};
