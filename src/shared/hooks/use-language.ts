import { createContext, useContext } from "react";

export type Language = "en" | "fr";

interface LanguageContextProps {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(
	undefined,
);

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};
