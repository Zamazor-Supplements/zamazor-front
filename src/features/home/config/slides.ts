import { APP_ROUTES } from "@/app/routes/paths";
import heroProtein from "@/assets/images/hero_protein.png";
import heroGreens from "@/assets/images/hero_greens.png";
import heroRecovery from "@/assets/images/hero_recovery.png";

export interface Slide {
	id: string | number;
	image: string;
	badge?: string;
	accent?: string;
	title: React.ReactNode;
	description: React.ReactNode;
	primaryAction?: {
		label: string;
		href: string;
		icon?: React.ReactNode;
	};
	secondaryAction?: {
		label: string;
		href: string;
	};
}

export const HERO_SLIDES: Slide[] = [
	{
		id: "protein-slide",
		image: heroProtein,
		badge: "Plant-powered performance",
		accent: "bg-emerald-500",
		title: "Clean supplements for energy, strength, and recovery.",
		description:
			"Build your daily stack with transparent formulas, great taste, and ingredients chosen for real routines.",
		primaryAction: {
			label: "Shop best sellers",
			href: "#products",
		},
		secondaryAction: {
			label: "Build my stack",
			href: "#stack",
		},
	},
	{
		id: "greens-slide",
		image: heroGreens,
		badge: "Morning clarity",
		accent: "bg-lime-500",
		title: "Start focused without the sugar crash.",
		description:
			"Hydration, electrolytes, adaptogens, and greens designed to help busy days feel lighter.",
		primaryAction: {
			label: "Build my stack",
			href: "#stack",
		},
		secondaryAction: {
			label: "Shop all",
			href: APP_ROUTES.SHOP,
		},
	},
	{
		id: "recovery-slide",
		image: heroRecovery,
		badge: "Recovery that keeps up",
		accent: "bg-teal-500",
		title: "Sleep deeper, recover faster, come back stronger.",
		description:
			"Support rest, muscle repair, and consistency with clean essentials for training and everyday wellness.",
		primaryAction: {
			label: "Explore recovery",
			href: "#recovery",
		},
		secondaryAction: {
			label: "Shop all",
			href: APP_ROUTES.SHOP,
		},
	},
];
