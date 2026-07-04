import { z } from "zod";

type ProfileSchemaLanguage = "en" | "fr";

const messages: Record<ProfileSchemaLanguage, { fullNameRequired: string; countryRequired: string }> = {
	en: {
		fullNameRequired: "Full name is required",
		countryRequired: "Country is required",
	},
	fr: {
		fullNameRequired: "Le nom complet est obligatoire",
		countryRequired: "Le pays est obligatoire",
	},
};

export const createProfileSchema = (language: ProfileSchemaLanguage = "en") => z.object({
	fullName: z.string().min(1, messages[language].fullNameRequired),
	street: z.string().optional(),
	city: z.string().optional(),
	phone: z.string().optional(),
	country: z.string().min(1, messages[language].countryRequired),
});

export const profileSchema = createProfileSchema();

export type ProfileFormValues = z.infer<typeof profileSchema>;
