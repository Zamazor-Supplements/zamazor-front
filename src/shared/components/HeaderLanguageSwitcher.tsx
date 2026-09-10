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
		<div className="mr-1 flex items-center gap-1 rounded-full border border-brand-950/10 bg-brand-50/50 p-0.5">
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
							? "bg-brand-900 text-white shadow-xs"
							: "text-brand-800 hover:bg-brand-50/30",
					)}
				>
					{lang}
				</button>
			))}
		</div>
	);
};
