import {
	type LucideIcon,
	DumbbellIcon,
	LeafIcon,
	ZapIcon,
	MoonIcon,
	HeartPulseIcon,
} from "lucide-react";

export type QuizStep = "intro" | "focus" | "diet" | "activity" | "result";
export type QuizFocus =
	| "performance"
	| "greens"
	| "wellness"
	| "energy"
	| "recovery"
	| "";

export interface QuizOption {
	id: string;
	label: string;
	desc: string;
	icon?: LucideIcon;
}

export const QUIZ_DIETS: QuizOption[] = [
	{
		id: "vegan",
		label: "Vegan / Plant-Based Only",
		desc: "No dairy or animal derivatives",
	},
	{
		id: "organic",
		label: "Organic & Non-GMO First",
		desc: "Purest certified organic raw crops",
	},
	{
		id: "keto",
		label: "Keto / Low-Carb Friendly",
		desc: "Sugar-free keto fats & minerals",
	},
	{
		id: "glutenFree",
		label: "Gluten & Soy Free",
		desc: "Safe allergen-conscious blends",
	},
];

export const QUIZ_FOCUSES: QuizOption[] = [
	{
		id: "performance",
		label: "Muscle Growth & Strength",
		icon: DumbbellIcon,
		desc: "Premium organic proteins",
	},
	{
		id: "greens",
		label: "Daily Micronutriments",
		icon: LeafIcon,
		desc: "Raw active superfood",
	},
	{
		id: "energy",
		label: "Natural Stamina & Focus",
		icon: ZapIcon,
		desc: "Clean pre-workout spark",
	},
	{
		id: "recovery",
		label: "Muscle Repair & Sleep",
		icon: MoonIcon,
		desc: "Organic recovery BCAAs",
	},
	{
		id: "wellness",
		label: "Immunity & Longevity",
		icon: HeartPulseIcon,
		desc: "Adaptogen calm extracts",
	},
];

export const QUIZ_ACTIVITIES: QuizOption[] = [
	{
		id: "sedentary",
		label: "Light Active",
		desc: "1-2 short sessions/week",
	},
	{
		id: "moderate",
		label: "Moderately Active",
		desc: "3-4 standard workouts/week",
	},
	{
		id: "intense",
		label: "Extremely Active",
		desc: "5+ high intensity workouts/week",
	},
];
